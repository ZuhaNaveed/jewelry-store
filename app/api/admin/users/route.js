import connectDB from "@/libs/mongodb";
import jwt from "jsonwebtoken";
import User from "@/models/user_model";

// POST - Admin login with specific credentials from .env
export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return new Response(
                JSON.stringify({ message: "Invalid admin credentials" }),
                { status: 401 }
            );
        }

        // Generate an admin token
        const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
            expiresIn: "4h",
        });

        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (err) {
        console.error("Admin login error:", err);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

// Helper to verify admin token
async function verifyAdmin(request) {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.role === "admin";
    } catch {
        return false;
    }
}

// GET - List all users (admin only)
export async function GET(request) {
    await connectDB();

    if (!(await verifyAdmin(request))) {
        return new Response(
            JSON.stringify({ message: "Unauthorized: Admin access required" }),
            { status: 403 }
        );
    }

    try {
        const users = await User.find({}).select("username email role createdAt");
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (err) {
        console.error("Admin fetch users error:", err);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

// DELETE - Delete a user by ID (admin only)
export async function DELETE(request) {
    await connectDB();

    if (!(await verifyAdmin(request))) {
        return new Response(
            JSON.stringify({ message: "Unauthorized: Admin access required" }),
            { status: 403 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return new Response(JSON.stringify({ message: "User ID required" }), {
                status: 400,
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        return new Response(
            JSON.stringify({ message: `User "${deletedUser.username}" deleted` }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Admin delete user error:", err);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
        });
    }
}

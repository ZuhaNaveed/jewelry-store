import connectDB from "@/libs/mongodb";
import User from "@/models/user_model";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

    const token = authHeader.split(" ")[1];
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("username email");
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ username: user.username, email: user.email }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Profile error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
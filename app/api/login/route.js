import connectDB from "@/libs/mongodb";
import User from "@/models/user_model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // recommended for password hashing

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password required" }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
    }

    // Compare password (plaintext or hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return new Response(JSON.stringify({ token }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
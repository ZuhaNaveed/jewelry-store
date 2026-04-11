import connectDB from "@/libs/mongodb";
import User from "@/models/user_model";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectDB();

  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
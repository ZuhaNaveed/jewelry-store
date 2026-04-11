import connectDB from "@/libs/mongodb";
import jwt from "jsonwebtoken";
import Order from "@/models/order_model";

// POST - Place a new order
export async function POST(request) {
  await connectDB();

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Authentication required" }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 403 });
    }

    const { items, totalAmount, shippingAddress, paymentMethod } = await request.json();

    if (!items || items.length === 0 || !totalAmount || !shippingAddress || !paymentMethod) {
      return new Response(JSON.stringify({ message: "Missing required order details" }), { status: 400 });
    }

    const order = await Order.create({
      userId: decoded.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Pending",
    });

    return new Response(JSON.stringify({ message: "Order placed successfully", orderId: order._id }), { status: 201 });
  } catch (err) {
    console.error("Order error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

// GET - Fetch order history for logged-in user
export async function GET(request) {
  await connectDB();

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Authentication required" }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 403 });
    }

    const orders = await Order.find({ userId: decoded.id }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
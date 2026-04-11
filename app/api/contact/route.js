import connectDB from "@/libs/mongodb";
import Message from "@/models/message_model";

export async function POST(request) {
    await connectDB();

    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }

        await Message.create({ name, email, message });

        return new Response(JSON.stringify({ message: "Message sent successfully!" }), { status: 201 });
    } catch (err) {
        console.error("Contact error:", err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

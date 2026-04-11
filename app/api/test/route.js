import connectDB from "@/libs/mongodb";

export async function GET() {
    await connectDB();

    return Response.json({
        message: "MongoDB connected successfully",
    });
}
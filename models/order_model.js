import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
            image: String,
        },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        name: String,
        email: String,
        address: String,
        city: String,
        zip: String,
        country: String,
    },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;

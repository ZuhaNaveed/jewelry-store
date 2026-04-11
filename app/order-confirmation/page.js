"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
            <h1 style={{ fontSize: "2.2rem", color: "var(--secondary-color)", marginBottom: "15px" }}>
                Order Placed Successfully!
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "10px" }}>
                Thank you for your purchase. Your order has been confirmed.
            </p>
            {orderId && (
                <p style={{ backgroundColor: "#f8f8f8", padding: "12px 20px", borderRadius: "8px", display: "inline-block", marginBottom: "30px", fontSize: "0.95rem" }}>
                    <strong>Order ID:</strong> #{orderId.slice(-8).toUpperCase()}
                </p>
            )}
            <p style={{ color: "#888", marginBottom: "30px" }}>
                You can view your order history in your profile page.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
                <Link
                    href="/profile"
                    style={{
                        backgroundColor: "var(--main-color)",
                        color: "white",
                        padding: "12px 25px",
                        borderRadius: "30px",
                        fontWeight: "500",
                        fontSize: "1rem",
                    }}
                >
                    View Order History
                </Link>
                <Link
                    href="/shop"
                    style={{
                        backgroundColor: "#f0f0f0",
                        color: "#333",
                        padding: "12px 25px",
                        borderRadius: "30px",
                        fontWeight: "500",
                        fontSize: "1rem",
                    }}
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function OrderConfirmation() {
    return (
        <>
            <Header />
            <Suspense fallback={<p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>}>
                <OrderConfirmationContent />
            </Suspense>
            <Footer />
        </>
    );
}

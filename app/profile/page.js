"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = window.localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error("Failed to parse profile response:", parseError);
          window.localStorage.removeItem("token");
          setError("Invalid response from server. Please log in again.");
          return;
        }

        if (response.ok) {
          setUser(data);
          // Fetch order history
          try {
            const ordersRes = await fetch("/api/orders", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (ordersRes.ok) {
              const ordersData = await ordersRes.json();
              setOrders(ordersData);
            }
          } catch (orderErr) {
            console.error("Error fetching orders:", orderErr);
          }
        } else {
          window.localStorage.removeItem("token");
          setError(data.message || "Failed to load profile. Please log in again.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        window.localStorage.removeItem("token");
        setError("Unable to connect to profile API. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setUser(null);
    setOrders([]);
    setError("");
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>User Profile</h1>
        <div style={{ backgroundColor: "#f8f8f8", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          {isLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <>
              <h2>{user.username}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "15px", flexWrap: "wrap" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "var(--main-color)",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "30px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Log Out
                </button>
                <button
                  onClick={() => router.push("/admin")}
                  style={{
                    backgroundColor: "#1a1a2e",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "30px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  🛡️ Admin Panel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Login Required</h2>
              <p>Log in or sign up to view your profile details.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <button
                  onClick={() => router.push("/login")}
                  style={{ padding: "10px 20px", borderRadius: "30px", cursor: "pointer" }}
                >
                  Log In
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  style={{ padding: "10px 20px", borderRadius: "30px", cursor: "pointer" }}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
          {error && !user && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
        </div>

        {/* Order History */}
        {user && (
          <div style={{ marginTop: "40px", textAlign: "left" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "20px", textAlign: "center", color: "var(--secondary-color)" }}>
              Order History
            </h2>
            {orders.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    backgroundColor: "#f8f8f8",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                    <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                    <span style={{
                      backgroundColor: order.status === "Pending" ? "#fff3cd" : "#d4edda",
                      color: order.status === "Pending" ? "#856404" : "#155724",
                      padding: "2px 10px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "10px" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "0.95rem" }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #ddd", fontWeight: "bold" }}>
                    <span>Total</span>
                    <span>Rs. {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

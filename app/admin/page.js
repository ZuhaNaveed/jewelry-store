"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
    const [adminToken, setAdminToken] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Check for existing admin token on mount
    useEffect(() => {
        const token = window.localStorage.getItem("adminToken");
        if (token) {
            setAdminToken(token);
        }
    }, []);

    // Fetch users when admin is logged in
    useEffect(() => {
        if (adminToken) fetchUsers();
    }, [adminToken]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                window.localStorage.setItem("adminToken", data.token);
                setAdminToken(data.token);
                setEmail("");
                setPassword("");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong.");
        }
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${adminToken}` },
            });

            const data = await res.json();

            if (res.ok) {
                setUsers(data);
            } else {
                setError(data.message || "Failed to load users.");
                if (res.status === 403) {
                    window.localStorage.removeItem("adminToken");
                    setAdminToken(null);
                }
            }
        } catch (err) {
            setError("Failed to load users.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId, username) => {
        if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;

        setSuccess("");
        setError("");

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` },
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                setUsers(users.filter((u) => u._id !== userId));
            } else {
                setError(data.message || "Failed to delete user.");
            }
        } catch (err) {
            setError("Failed to delete user.");
        }
    };

    const handleLogout = () => {
        window.localStorage.removeItem("adminToken");
        setAdminToken(null);
        setUsers([]);
        setSuccess("");
        setError("");
    };

    // ─── LOGIN SCREEN ───
    if (!adminToken) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a2e" }}>
                <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)", width: "100%", maxWidth: "400px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "1.8rem", marginBottom: "8px", color: "#1a1a2e" }}>🔐 Admin Login</h1>
                    <p style={{ color: "#888", marginBottom: "25px", fontSize: "0.9rem" }}>Enter admin credentials to continue</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "15px", fontSize: "1rem", boxSizing: "border-box" }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "20px", fontSize: "1rem", boxSizing: "border-box" }}
                        />
                        <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer", fontWeight: "600" }}>
                            Log In
                        </button>
                    </form>
                    {error && <p style={{ color: "#dc3545", marginTop: "15px" }}>{error}</p>}
                </div>
            </div>
        );
    }

    // ─── ADMIN DASHBOARD ───
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
            {/* Top Bar */}
            <div style={{ backgroundColor: "#1a1a2e", color: "white", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ fontSize: "1.4rem", margin: 0 }}>🛡️ Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" }}
                >
                    Logout
                </button>
            </div>

            <div style={{ maxWidth: "1000px", margin: "30px auto", padding: "0 20px" }}>
                {/* Stats */}
                <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textAlign: "center" }}>
                        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1a1a2e", margin: 0 }}>{users.length}</p>
                        <p style={{ color: "#888", margin: 0 }}>Total Users</p>
                    </div>
                    <div style={{ flex: 1, minWidth: "200px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textAlign: "center" }}>
                        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#155724", margin: 0 }}>{users.filter(u => u.role === "admin").length}</p>
                        <p style={{ color: "#888", margin: 0 }}>Admins</p>
                    </div>
                    <div style={{ flex: 1, minWidth: "200px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textAlign: "center" }}>
                        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0056b3", margin: 0 }}>{users.filter(u => u.role === "user").length}</p>
                        <p style={{ color: "#888", margin: 0 }}>Regular Users</p>
                    </div>
                </div>

                {/* Alerts */}
                {success && (
                    <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
                        ✅ {success}
                    </div>
                )}
                {error && (
                    <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px" }}>
                        ❌ {error}
                    </div>
                )}

                {/* User Table */}
                <div style={{ backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                    <div style={{ padding: "20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#1a1a2e" }}>Registered Users</h2>
                        <button onClick={fetchUsers} style={{ backgroundColor: "#0056b3", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                            🔄 Refresh
                        </button>
                    </div>

                    {isLoading ? (
                        <p style={{ padding: "30px", textAlign: "center", color: "#888" }}>Loading users...</p>
                    ) : users.length === 0 ? (
                        <p style={{ padding: "30px", textAlign: "center", color: "#888" }}>No users found.</p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>#</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>Username</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>Email</th>
                                        <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#555" }}>Role</th>
                                        <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", color: "#555" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                            <td style={{ padding: "12px 16px", color: "#888" }}>{index + 1}</td>
                                            <td style={{ padding: "12px 16px", fontWeight: "500" }}>{user.username}</td>
                                            <td style={{ padding: "12px 16px", color: "#555" }}>{user.email}</td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{
                                                    backgroundColor: user.role === "admin" ? "#d4edda" : "#e2e3e5",
                                                    color: user.role === "admin" ? "#155724" : "#383d41",
                                                    padding: "4px 12px",
                                                    borderRadius: "12px",
                                                    fontSize: "0.8rem",
                                                    fontWeight: "500",
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                <button
                                                    onClick={() => handleDelete(user._id, user.username)}
                                                    style={{
                                                        backgroundColor: "#dc3545",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "6px 18px",
                                                        borderRadius: "20px",
                                                        cursor: "pointer",
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

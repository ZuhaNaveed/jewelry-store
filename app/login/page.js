"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                window.localStorage.setItem("token", data.token);
                router.push("/profile");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
                <button type="submit">Log In</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p style={{ marginTop: "20px" }}>
                Don't have an account?{" "}
                <button
                    onClick={() => router.push("/signup")}
                    style={{ background: "none", border: "none", color: "var(--main-color)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", textDecoration: "underline" }}
                >
                    Sign Up
                </button>
            </p>
        </div>
    );
}
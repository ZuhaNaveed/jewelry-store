"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Signup successful! Redirecting to login...");
                setForm({ username: "", email: "", password: "" });
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required /><br /><br />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
                <button type="submit">Sign Up</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <p style={{ marginTop: "20px" }}>
                Already have an account?{" "}
                <button
                    onClick={() => router.push("/login")}
                    style={{ background: "none", border: "none", color: "var(--main-color)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", textDecoration: "underline" }}
                >
                    Log In
                </button>
            </p>
        </div>
    );
}
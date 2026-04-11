"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.message || "Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Contact error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="intro">We'd love to hear from you! Please reach out with any questions, feedback, or inquiries.</p>
        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
            <textarea name="message" rows="5" placeholder="Your Message" value={form.message} onChange={handleChange} required></textarea>
            <button type="submit">Send Message</button>
          </form>
          {status && <p style={{ color: "green", marginTop: "20px", textAlign: "center" }}>{status}</p>}
          {error && <p style={{ color: "red", marginTop: "20px", textAlign: "center" }}>{error}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
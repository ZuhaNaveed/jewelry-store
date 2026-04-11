// components/CheckoutForm.js (No changes from previous response)
"use client";

import React, { useState } from 'react';

export default function CheckoutForm({ onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    paymentMethod: 'cash_on_delivery', // Default payment method
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
  };

  const selectStyle = {
    ...inputStyle, // Inherit styles from input
    appearance: 'none', // Remove default arrow for better styling
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l4 4 4-4\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.7em top 50%',
    backgroundSize: '1.2em auto',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>Shipping Information</h2>

      {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

      <div>
        <label htmlFor="name" style={labelStyle}>Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="email" style={labelStyle}>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="address" style={labelStyle}>Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label htmlFor="city" style={labelStyle}>City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="zip" style={labelStyle}>Zip Code:</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label htmlFor="country" style={labelStyle}>Country:</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', marginTop: '30px', textAlign: 'center' }}>Payment Method</h2>
      <div>
        <label htmlFor="paymentMethod" style={labelStyle}>Select Method:</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
          style={selectStyle}
        >
          <option value="cash_on_delivery">Cash on Delivery</option>
          {/* Add other payment options later if you integrate with gateways */}
          {/* <option value="credit_card">Credit Card (coming soon)</option> */}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          backgroundColor: 'var(--main-color)',
          color: 'white',
          padding: '12px 25px',
          borderRadius: '30px',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginTop: '30px',
          fontWeight: '600',
          fontSize: '1.1rem',
          transition: 'background-color 0.3s ease',
        }}
      >
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}
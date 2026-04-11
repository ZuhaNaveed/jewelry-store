"use client";

import { useState } from 'react';

export default function LoginButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const url = isLoginMode ? '/api/login' : '/api/signup';
    const payload = isLoginMode
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log(`API ${url} response (status: ${response.status}):`, responseText); // Log for debugging

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          const message = errorData.message || {
            400: 'Invalid input provided',
            401: 'Invalid credentials',
            409: 'Account already exists',
            500: 'Server error, please try again later',
          }[response.status] || `Operation failed (Status: ${response.status})`;
          setError(message);
        } catch (jsonError) {
          setError(`Invalid response from ${url}. Ensure the API is running at http://localhost:3000${url}.`);
        }
        setIsLoading(false);
        return;
      }

      const data = JSON.parse(responseText);
      if (isLoginMode) {
        window.localStorage.setItem('token', data.token);
        window.location.reload(); // Refresh to update Profile page
      } else {
        setIsLoginMode(true);
        setError('Account created successfully! Please log in.');
      }
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Network error:', error);
      setError(`Unable to connect to ${url}. Please check if the server is running or try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        style={{
          backgroundColor: 'var(--main-color)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '30px', // Matches banner button style
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginTop: '10px',
          fontWeight: '500',
          transition: 'background-color 0.3s ease',
        }}
        onClick={() => setShowModal(true)}
        disabled={isLoading}
      >
        Log In / Sign Up
      </button>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', textAlign: 'center' }}>
              {isLoginMode ? 'Login' : 'Sign Up'}
            </h2>
            {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              {!isLoginMode && (
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Username:
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                  />
                </div>
              )}
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Password:
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                />
              </div>
              {!isLoginMode && (
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Confirm Password:
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  width: '100%',
                  marginBottom: '15px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {isLoading ? 'Processing...' : isLoginMode ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginBottom: '15px' }}>
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
              <span
                style={{ color: 'var(--main-color)', cursor: 'pointer', marginLeft: '5px', fontWeight: '500' }}
                onClick={() => {
                  setError('');
                  setIsLoginMode(!isLoginMode);
                }}
              >
                {isLoginMode ? 'Sign up' : 'Log in'}
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                setError('');
                setShowModal(false);
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                cursor: 'pointer',
                width: '100%',
                fontWeight: '500',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
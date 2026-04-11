// app/checkout/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CheckoutForm from '../../components/CheckoutForm';
import { useCart } from '../../components/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cart.length === 0 && !orderPlaced) {
        alert('Your cart is empty. Please add items to proceed to checkout.');
        router.push('/shop');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [cart, orderPlaced, router]);

  const handlePlaceOrder = async (shippingInfo) => {
    setError('');
    setIsLoading(true);

    if (cart.length === 0) {
      setError('Cannot place order: Your cart is empty.');
      setIsLoading(false);
      return;
    }

    const token = window.localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to place an order.');
      setIsLoading(false);
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          // Ensure price is a number when sending to API
          price: parseFloat(item.price) || 0, // Default to 0 if invalid
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: getCartTotal(),
        shippingAddress: shippingInfo,
        paymentMethod: shippingInfo.paymentMethod,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const responseText = await response.text();
      console.log('API /api/orders response (status: ${response.status}):', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        alert('Order placed successfully! Order ID: ' + data.orderId);
        clearCart();
        setOrderPlaced(true);
        router.push(`/order-confirmation?orderId=${data.orderId}`);
      } else {
        try {
          const errorData = JSON.parse(responseText);
          setError(errorData.message || 'Failed to place order. Please try again.');
        } catch (e) {
          setError('An unexpected error occurred while placing your order.');
        }
      }
    } catch (apiError) {
      console.error('Error placing order:', apiError);
      setError('Unable to connect to the order service. Please check your internet connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="checkout-container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', display: 'flex', gap: '40px', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '30px', textAlign: 'center', color: 'var(--main-color)' }}>Checkout</h1>

        {!orderPlaced && cart.length > 0 ? (
          <>
            <div className="order-summary" style={{ backgroundColor: '#f8f8f8', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Order Summary</h2>
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', borderBottom: '1px solid #eee' }}>
                {cart.map((item) => {
                  // Log item price and type for debugging
                  console.log(`CheckoutPage: Item '${item.name}' Price: ${item.price}, Type: ${typeof item.price}`);
                  return (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #eee' }}>
                      <span style={{ fontWeight: '500' }}>{item.name} (x{item.quantity})</span>
                      {/* Display item subtotal with currency, handle potential NaN */}
                      <span>
                        Rs. {(typeof item.price === 'number' && !isNaN(item.price)) ? (item.price * item.quantity).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '2px solid var(--main-color)', fontSize: '1.4rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                {/* Display total with currency, handle potential NaN */}
                <span>
                  Rs. {(typeof getCartTotal() === 'number' && !isNaN(getCartTotal())) ? getCartTotal().toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <CheckoutForm
              onSubmit={handlePlaceOrder}
              isLoading={isLoading}
              error={error}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f0f8ff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {orderPlaced ? (
              <h2 style={{ color: 'green', fontSize: '2rem' }}>Your order has been placed successfully!</h2>
            ) : (
              <h2 style={{ color: '#888', fontSize: '2rem' }}>Your cart is empty.</h2>
            )}
            <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>
              {orderPlaced ? "Thank you for your purchase!" : "Add some beautiful jewelry to your cart to proceed to checkout."}
            </p>
            <button
              onClick={() => router.push('/shop')}
              style={{
                marginTop: '30px',
                backgroundColor: 'var(--main-color)',
                color: 'white',
                padding: '12px 25px',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'background-color 0.3s ease',
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
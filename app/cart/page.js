"use client";
import { useContext } from 'react';
import { CartContext } from '../../components/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, getCartTotal } = useContext(CartContext);

  const handleIncrease = (item) => {
    addToCart(item);
  };

  return (
    <>
      <Header />
      <div className="cart-page-container" style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '30px', textAlign: 'center', color: 'var(--main-color)' }}>Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f0f8ff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Your cart is empty.</p>
            <Link href="/shop" style={{
              backgroundColor: 'var(--main-color)',
              color: 'white',
              padding: '12px 25px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'background-color 0.3s ease',
            }}>
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items" style={{ backgroundColor: '#f8f8f8', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              {cart.map((item) => {
                // Log item price and type for debugging
                console.log(`CartPage: Item '${item.name}' Price: ${item.price}, Type: ${typeof item.price}`);
                return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #eee',
                    gap: '15px'
                  }}
                >
                  <img
                    src={item.image || '/public/placeholder.jpg'}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ margin: '0', fontSize: '1.4rem' }}>{item.name}</h3>
                    {/* Display individual item price with currency, handle potential NaN */}
                    <p style={{ margin: '5px 0', color: '#555', fontSize: '1.1rem' }}>
                      Rs. {(typeof item.price === 'number' && !isNaN(item.price)) ? item.price.toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      style={{
                        width: '35px',
                        height: '35px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>{item.quantity}</span>
                    <button
                      style={{
                        width: '35px',
                        height: '35px',
                        backgroundColor: 'var(--main-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Delete
                  </button>
                </div>
              )})}
            </div>

            <div className="cart-summary-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'right', borderTop: '2px solid var(--main-color)', paddingTop: '20px', width: '100%' }}>
                {/* Display total with currency, handle potential NaN */}
                Total: <span style={{ color: 'var(--main-color)' }}>
                  Rs. {(typeof getCartTotal() === 'number' && !isNaN(getCartTotal())) ? getCartTotal().toFixed(2) : '0.00'}
                </span>
              </p>
              <Link href="/checkout" style={{
                backgroundColor: 'var(--main-color)',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.2rem',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'inline-block'
              }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
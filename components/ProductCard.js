"use client";
import Image from 'next/image';
import { useContext } from 'react';
import { CartContext } from './CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    alert(`Adding ${product.name} to cart!`); // Debug alert
    addToCart(product);
  };

  return (
    <div className="product-item">
      <Image
        src={product.image}
        alt={product.name}
        width={280}
        height={200}
        style={{ objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
      />
      <h3>{product.name}</h3>
      <p className="price">{product.price}</p>
      <p className="description">{product.description}</p>
      <button
        className="add-to-cart-btn"
        style={{
          backgroundColor: 'var(--main-color)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
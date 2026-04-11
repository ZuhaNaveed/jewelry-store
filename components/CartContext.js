"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

// Helper function to clean and parse price strings
// This function will remove currency symbols and commas before parsing
const cleanAndParsePrice = (priceString) => {
  if (typeof priceString !== 'string') {
    return parseFloat(priceString); // Already a number or something parseFloat can handle directly
  }
  // Remove '₨', commas, and any leading/trailing whitespace
  const cleanedString = priceString.replace(/₨\s*|,\s*/g, '').trim();
  const parsedPrice = parseFloat(cleanedString);
  return isNaN(parsedPrice) ? 0 : parsedPrice; // Return 0 if still NaN
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      const storedCart = window.localStorage.getItem('cartItems');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart).map(item => {
            // Clean and parse price when loading from localStorage
            const numericPrice = cleanAndParsePrice(item.price);
            if (isNaN(numericPrice)) {
              console.warn(`CartContext: Non-numeric price '${item.price}' found for item '${item.name}' in localStorage. Setting to 0.`);
              return { ...item, price: 0 };
            }
            return { ...item, price: numericPrice };
          });
          setCart(parsedCart);
        } catch (e) {
          console.error("CartContext: Failed to parse cart from localStorage:", e);
          window.localStorage.removeItem('cartItems');
          setCart([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      window.localStorage.setItem('cartItems', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const addToCart = (product) => {
    console.log('CartContext: Attempting to add:', product);
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        console.log(`CartContext: Item '${product.name}' already in cart, increasing quantity.`);
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Clean and parse price when first adding to cart
        const numericPrice = cleanAndParsePrice(product.price);
        if (isNaN(numericPrice) || numericPrice <= 0) { // Also check for zero or negative price
          console.error(`CartContext: Invalid or non-positive price '${product.price}' encountered when adding item '${product.name}'. Item not added.`);
          return prevCart;
        }
        console.log(`CartContext: Adding new item '${product.name}' with price: ${numericPrice}`);
        return [...prevCart, { ...product, price: numericPrice, quantity: 1 }];
      }
    });
  };

  const decreaseQuantity = (productId) => {
    console.log('CartContext: Decreasing quantity for item with ID:', productId);
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const removeFromCart = (productId) => {
    console.log('CartContext: Removing item with ID:', productId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const getCartTotal = () => {
    const total = Array.isArray(cart) ? cart.reduce((sum, item) => {
      // Safeguard: Use the helper function here too, though ideally not needed after initial parsing
      const itemPrice = cleanAndParsePrice(item.price);
      if (isNaN(itemPrice)) {
        console.warn(`CartContext: Non-numeric price '${item.price}' found in cart item '${item.name}' during total calculation. Treating as 0.`);
        return sum;
      }
      return sum + (itemPrice * item.quantity);
    }, 0) : 0;
    console.log('CartContext: Calculated total:', total);
    return total;
  };

  const getCartItemCount = () => {
    const count = Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
    console.log('CartContext: Calculated item count:', count);
    return count;
  };

  const clearCart = () => {
    console.log('CartContext: Clearing cart.');
    setCart([]);
  };

  console.log('CartContext: Current cart state:', cart);

  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, getCartTotal, getCartItemCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
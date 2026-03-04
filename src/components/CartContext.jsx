"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product, quantity = 1, size = null) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.slug === product.slug && item.selectedSize === size
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.slug === product.slug && item.selectedSize === size
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, qty: quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (slug, size = null) => {
    setCart((prevCart) => 
      prevCart.filter((item) => !(item.slug === slug && item.selectedSize === size))
    );
  };

  const updateQuantity = (slug, size = null, qty) => {
    if (qty < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.slug === slug && item.selectedSize === size ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isInitialized,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

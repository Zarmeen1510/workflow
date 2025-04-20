// src/context/CartContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Cart items updated:", cartItems); // Debug log
  }, [cartItems]);

  const addToCart = (product, quantity = 1, color = "Default", size = "Default") => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.color === color && item.size === size
      );

      if (existingItem) {
        const updatedItems = prevItems.map((item) =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log("Updated existing item:", updatedItems); // Debug log
        return updatedItems;
      }

      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        quantity,
        color,
        size,
      };
      const updatedItems = [...prevItems, newItem];
      console.log("Added new item:", updatedItems); // Debug log
      return updatedItems;
    });
  };

  const updateQuantity = (id, color, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (id, color, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && item.color === color && item.size === size)
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
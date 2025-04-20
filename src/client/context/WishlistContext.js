// src/context/WishlistContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    console.log("Wishlist items updated:", wishlistItems); // Debug log
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      if (prevItems.find((item) => item.id === product.id)) {
        return prevItems; // Prevent duplicates
      }
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || null,
        color: "Default", // Default for HomePage; can be updated in ProductsPage
        size: "Default",
        inStock: true, // Assume in stock for simplicity
        image: product.image,
        slug: product.slug,
      };
      console.log("Added to wishlist:", newItem); // Debug log
      return [...prevItems, newItem];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      console.log("Removed from wishlist, new items:", updatedItems); // Debug log
      return updatedItems;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
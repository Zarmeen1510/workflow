// src/components/Header.jsx
"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Header = () => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    console.log("Header cartItems:", cartItems);
    console.log("Header wishlistItems:", wishlistItems);
  }, [cartItems, wishlistItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchFocus = (e) => {
    e.stopPropagation();
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement actual dark mode toggling here
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "AOrder", href: "/adminorders" },
    { name: "AProduct", href: "/adminproducts" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="bg-emerald-600 text-white py-2 text-center text-sm">
        <p>Free shipping on orders over $50 | Use code WELCOME10 for 10% off your first order</p>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight">ShopVista</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === link.href ? "text-emerald-600" : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex relative w-full max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onClick={(e) => e.stopPropagation()}
              />
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 p-2">
                  <div className="p-2 text-sm">No results found</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </button>
            <Link to="/login" className="hidden md:flex">
              <button className="h-10 w-10 flex items-center justify-center rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </button>
            </Link>
            <Link to="/wishlist" className="hidden md:flex relative">
              <button className="h-10 w-10 flex items-center justify-center rounded-full">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-600 text-white rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </Link>
            <Link to="/cart" className="relative">
              <button className="h-10 w-10 flex items-center justify-center rounded-full">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-600 text-white rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
            <button
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onClick={(e) => e.stopPropagation()}
            />
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 p-2">
                <div className="p-2 text-sm">No results found</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                    location.pathname === link.href ? "text-emerald-600" : "text-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4 pt-2 border-t">
              <Link to="/login" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account</span>
              </Link>
              <Link to="/wishlist" className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>
              <button onClick={toggleDarkMode} className="ml-auto flex items-center space-x-2">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
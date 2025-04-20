"use client";

import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingCart, Heart, Bitcoin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

const HomePage = () => {
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [txId, setTxId] = useState(""); // Store user-entered TXID
  const [txStatus, setTxStatus] = useState(null); // Store transaction details

  // Blockchair API key (WARNING: Exposed in frontend for demo only)
  const BLOCKCHAIR_API_KEY = "YOUR_BLOCKCHAIR_API_KEY"; // Replace with your key

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.5,
      reviewCount: 120,
      image: "https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isNew: true,
      isSale: true,
      slug: "premium-cotton-t-shirt",
    },
    {
      id: 2,
      name: "Slim Fit Jeans",
      price: 59.99,
      originalPrice: null,
      rating: 4.8,
      reviewCount: 85,
      image: "https://cart-mart.netlify.app/img/products/f2.jpg",
      isNew: true,
      isSale: false,
      slug: "slim-fit-jeans",
    },
    {
      id: 3,
      name: "Leather Crossbody Bag",
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.7,
      reviewCount: 64,
      image: "https://cart-mart.netlify.app/img/products/f3.jpg",
      isNew: false,
      isSale: true,
      slug: "leather-crossbody-bag",
    },
    {
      id: 4,
      name: "Wireless Headphones",
      price: 129.99,
      originalPrice: 149.99,
      rating: 4.9,
      reviewCount: 210,
      image: "https://cart-mart.netlify.app/img/products/f6.jpg",
      isNew: false,
      isSale: true,
      slug: "wireless-headphones",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Men's Fashion",
      image: "https://cart-mart.netlify.app/img/shop/19.jpg",
      count: 120,
      slug: "mens-fashion",
    },
    {
      id: 2,
      name: "Women's Fashion",
      image: "https://cart-mart.netlify.app/img/shop/17.jpg",
      count: 150,
      slug: "womens-fashion",
    },
    {
      id: 3,
      name: "Accessories",
      image: "https://cart-mart.netlify.app/img/shop/20.jpg",
      count: 80,
      slug: "accessories",
    },
    {
      id: 4,
      name: "Footwear",
      image: "https://cart-mart.netlify.app/img/products/f7.jpg",
      count: 95,
      slug: "footwear",
    },
    {
      id: 5,
      name: "Electronics",
      image: "https://cart-mart.netlify.app/img/shop/21.jpg",
      count: 110,
      slug: "electronics",
    },
    {
      id: 6,
      name: "Home & Living",
      image: "https://cart-mart.netlify.app/img/shop/16.jpg",
      count: 75,
      slug: "home-living",
    },
  ];

  const handleAddToCart = (product) => {
    addToCart(product, 1, "Default", "Default");
    toast.success(`${product.name} has been added to your cart!`);
  };

  const handleToggleWishlist = (product) => {
    const isInWishlist = wishlistItems.find((item) => item.id === product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const handleVerifyTransaction = async () => {
    if (!txId) {
      toast.error("Please enter a Transaction ID.");
      return;
    }
    try {
      const response = await axios.get(
        `https://api.blockchair.com/bitcoin/transactions/${txId}?key=${BLOCKCHAIR_API_KEY}`
      );
      const txData = response.data.data[txId];
      setTxStatus({
        status: txData.status,
        amount: txData.amount,
        time: txData.time,
      });
      toast.success(`Transaction status: ${txData.status}`);
    } catch (error) {
      toast.error("Failed to verify transaction. Check the Transaction ID.");
      setTxStatus(null);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTxId("");
    setTxStatus(null);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Summer Collection <span className="text-emerald-600">2025</span>
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                  Discover the latest trends and styles for the summer season.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium">
                  Shop Now
                </Link>
                <Link to="/categories" className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
                  Explore Collections
                </Link>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden"
                    >
                      <img
                        src={`https://cart-mart.netlify.app/img/hero4.png`}
                        alt={`Customer ${i}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-medium">500+</span> happy customers
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-200">
                <img
                  src="https://cdn.pixabay.com/photo/2018/06/04/00/29/women-3452067_1280.jpg"
                  alt="Summer Collection"
                  className="h-full bg-center bg-left w-full object-contain"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white shadow-lg rounded-lg p-4 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">30%</span>
                  </div>
                  <div>
                    <p className="font-medium">Summer Sale</p>
                    <p className="text-sm text-gray-600">Use code: SUMMER30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/4 left-0 h-64 w-64 rounded-full bg-emerald-200/20 -z-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-emerald-200/20 -z-10 blur-3xl"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-gray-600 mt-2">Browse our wide range of products by category</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/categories/${category.slug}`} className="group">
                <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center text-white p-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm">{category.count} Products</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-gray-600 mt-2">Handpicked products for you</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <Link to="/products" className="text-emerald-600 hover:underline font-medium">
                View All Products →
              </Link>
              <button
                onClick={openModal}
                className="flex items-center text-emerald-600 hover:underline font-medium"
              >
                <Bitcoin className="h-4 w-4 mr-1" /> Verify Crypto Payment
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const isInWishlist = wishlistItems.find((item) => item.id === product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
                      )}
                      {product.isSale && (
                        <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded">Sale</span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <button
                        className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleToggleWishlist(product)}
                      >
                        <Heart
                          className={`h-4 w-4 ${isInWishlist ? "text-red-500 fill-red-500" : ""}`}
                        />
                        <span className="sr-only">{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
                      </button>
                      <button
                        className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link to={`/products/${product.slug}`} className="block">
                      <h3 className="font-medium text-lg mb-1 hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < product.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Crypto Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Verify Bitcoin Payment</h3>
            <p className="text-gray-600 mb-4">
              Enter a Bitcoin Transaction ID (TXID) to check its status on the blockchain.
            </p>
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
            />
            <button
              onClick={handleVerifyTransaction}
              className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              Verify Transaction
            </button>
            {txStatus && (
              <div className="mt-4">
                <p className="text-sm font-medium">Transaction Status:</p>
                <p className="text-sm">{txStatus.status}</p>
                {txStatus.status === "confirmed" && (
                  <>
                    <p className="text-sm">Amount: {txStatus.amount} BTC</p>
                    <p className="text-sm">Time: {new Date(txStatus.time).toLocaleString()}</p>
                  </>
                )}
              </div>
            )}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-200 px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Special Offers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Special Offers</h2>
            <p className="text-gray-600 mt-2">Limited time deals you don't want to miss</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700 text-white">
              <div className="absolute inset-0 mix-blend-overlay">
                <img
                  src="https://via.placeholder.com/600x400?text=Summer+Sale"
                  alt="Summer Sale"
                  className="h-full w-full object-cover opacity-20"
                />
              </div>
              <div className="relative p-8 md:p-10 flex flex-col h-full min-h-[300px] justify-between">
                <div>
                  <span className="inline-block bg-white text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    Limited Time
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Summer Sale</h3>
                  <p className="text-emerald-50 mb-4">
                    Up to 50% off on summer essentials. Refresh your wardrobe today!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/products" className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-2 rounded-md font-medium">
                    Shop Now
                  </Link>
                  <Link to="/offers/summer-sale" className="inline-flex items-center text-white hover:underline">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="absolute inset-0 mix-blend-overlay">
                <img
                  src="https://via.placeholder.com/600x400?text=New+Arrivals"
                  alt="New Arrivals"
                  className="h-full w-full object-cover opacity-20"
                />
              </div>
              <div className="relative p-8 md:p-10 flex flex-col h-full min-h-[300px] justify-between">
                <div>
                  <span className="inline-block bg-white text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    Just Launched
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">New Arrivals</h3>
                  <p className="text-indigo-50 mb-4">
                    Discover our latest collection of premium products just for you.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/products" className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-2 rounded-md font-medium">
                    Explore Now
                  </Link>
                  <Link to="/new-arrivals" className="inline-flex items-center text-white hover:underline">
                    View Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter and be the first to know about new products, special offers, and exclusive
              discounts.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border rounded-md"
                required
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
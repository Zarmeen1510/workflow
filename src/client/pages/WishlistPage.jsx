// src/pages/WishlistPage.jsx
"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id));
    }
  };

  const removeSelected = () => {
    selectedItems.forEach((id) => removeFromWishlist(id));
    setSelectedItems([]);
    toast.info(`${selectedItems.length} item(s) removed from wishlist.`);
  };

  const handleAddToCart = (item) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        slug: item.slug,
      },
      1,
      item.color,
      item.size
    );
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Heart className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist and review them anytime.</p>
          <Link to="/products" className="px-6 py-3 bg-emerald-600 text-white rounded-md inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <input
                id="select-all"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={selectedItems.length === wishlistItems.length && wishlistItems.length > 0}
                onChange={selectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({wishlistItems.length} items)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              {selectedItems.length > 0 && (
                <button
                  className="px-3 py-1 text-red-500 border border-red-500 rounded-md text-sm flex items-center"
                  onClick={removeSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Selected
                </button>
              )}
              <button
                className="px-3 py-1 text-red-500 border border-red-500 rounded-md text-sm flex items-center"
                onClick={() => {
                  clearWishlist();
                  setSelectedItems([]);
                  toast.info("Wishlist cleared.");
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Wishlist
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="space-y-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex items-center self-start">
                      <input
                        id={`select-${item.id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 mr-4"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                    </div>

                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/products/${item.slug}`}
                            className="font-medium hover:text-emerald-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">
                            <span>Color: {item.color}</span>
                            <span className="mx-2">•</span>
                            <span>Size: {item.size}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                            {item.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            {item.inStock ? (
                              <span className="text-sm text-emerald-600">In Stock</span>
                            ) : (
                              <span className="text-sm text-red-500">Out of Stock</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          <button
                            className={`px-3 py-1 bg-emerald-600 text-white rounded-md flex items-center ${
                              !item.inStock ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!item.inStock}
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </button>

                          <button
                            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              removeFromWishlist(item.id);
                              toast.info(`${item.name} removed from wishlist.`);
                            }}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            <Link to="/products" className="px-6 py-3 border rounded-md text-center">
              Continue Shopping
            </Link>

            <Link to="/cart" className="px-6 py-3 bg-emerald-600 text-white rounded-md text-center">
              View Cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
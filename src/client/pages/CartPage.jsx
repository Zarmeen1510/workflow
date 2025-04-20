"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, ArrowRight, CreditCard, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 ? 0 : 4.99;
  const tax = (subtotal - discount) * 0.07;
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Cart Items ({cartItems.length})</h2>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.color}-${item.size}`}
                      className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
                    >
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
                            <div className="text-sm font-medium mt-1">${item.price.toFixed(2)}</div>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <div className="flex items-center mr-4">
                              <button
                                className="h-8 w-8 flex items-center justify-center border border-r-0 rounded-l-md"
                                onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                                <span className="sr-only">Decrease quantity</span>
                              </button>
                              <div className="h-8 px-3 flex items-center justify-center border-y border-gray-300 min-w-[2.5rem] text-sm">
                                {item.quantity}
                              </div>
                              <button
                                className="h-8 w-8 flex items-center justify-center border border-l-0 rounded-r-md"
                                onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                                <span className="sr-only">Increase quantity</span>
                              </button>
                            </div>
                            <button
                              className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              onClick={() => removeItem(item.id, item.color, item.size)}
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
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="px-6 py-3 border rounded-md text-center sm:flex-1 flex items-center justify-center"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="px-6 py-3 bg-emerald-600 text-white rounded-md text-center sm:flex-1 flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 px-4 py-2 border rounded-md"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                      />
                      <button
                        className="px-4 py-2 border rounded-md"
                        onClick={applyPromoCode}
                        disabled={promoApplied || !promoCode}
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <div className="text-sm text-emerald-600 mb-4">Promo code applied successfully!</div>
                    )}
                    <Link
                      to="/checkout"
                      className="block w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-center"
                    >
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2 inline-block" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 border-t">
                <h3 className="font-medium mb-4">We Accept</h3>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-12 bg-white rounded border flex items-center justify-center">
                    <img src="https://via.placeholder.com/30x20?text=Visa" alt="Visa" className="h-5" />
                  </div>
                  <div className="h-8 w-12 bg-white rounded border flex items-center justify-center">
                    <img src="https://via.placeholder.com/30x20?text=MC" alt="Mastercard" className="h-5" />
                  </div>
                  <div className="h-8 w-12 bg-white rounded border flex items-center justify-center">
                    <img src="https://via.placeholder.com/30x20?text=Amex" alt="American Express" className="h-5" />
                  </div>
                  <div className="h-8 w-12 bg-white rounded border flex items-center justify-center">
                    <img src="https://via.placeholder.com/30x20?text=PayPal" alt="PayPal" className="h-5" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Truck className="h-4 w-4 mr-2" />
                    Free shipping on orders over $100
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Secure payment processing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
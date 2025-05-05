"use client";

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, Minus, Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

// Mock product data
const product = {
  id: 1,
  name: "Premium Cotton T-Shirt",
  price: 29.99,
  originalPrice: 39.99,
  rating: 4.5,
  reviewCount: 120,
  images: [
    "https://cart-mart.netlify.app/img/products/f2.jpg",
    "https://cart-mart.netlify.app/img/products/f3.jpg",
    "https://cart-mart.netlify.app/img/products/n2.jpg",
    "https://cart-mart.netlify.app/img/products/f6.jpg  ",
  ],
  colors: [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Gray", value: "#808080" },
    { name: "Navy", value: "#000080" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  description:
    "Our Premium Cotton T-Shirt is crafted from 100% organic cotton for exceptional comfort and durability. The classic fit and soft fabric make it perfect for everyday wear, while the reinforced stitching ensures it will last through countless washes. Available in multiple colors, this versatile t-shirt is a must-have addition to any wardrobe.",
  features: ["100% organic cotton", "Classic fit", "Reinforced stitching", "Pre-shrunk fabric", "Machine washable"],
  details: {
    material: "100% Organic Cotton",
    fit: "Classic Fit",
    care: "Machine wash cold, tumble dry low",
    origin: "Ethically made in Portugal",
  },
  stock: 25,
  isNew: true,
  isSale: true,
  category: "Clothing",
  brand: "FashionBrand",
  slug: "premium-cotton-t-shirt",
  relatedProducts: [
    {
      id: 2,
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "https://cart-mart.netlify.app/img/shop/1.jpg",
      slug: "slim-fit-jeans",
    },
    {
      id: 8,
      name: "Denim Jacket",
      price: 69.99,
      image: "https://cart-mart.netlify.app/img/shop/4.jpg",
      slug: "denim-jacket",
    },
    {
      id: 12,
      name: "Graphic T-Shirt",
      price: 24.99,
      image: "https://cart-mart.netlify.app/img/products/f6.jpg",
      slug: "graphic-t-shirt",
    },
    {
      id: 9,
      name: "Casual Sneakers",
      price: 59.99,
      image: "https://cart-mart.netlify.app/img/shop/3.jpg",
      slug: "casual-sneakers",
    },
  ],
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]); // Default to M
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor.name, selectedSize);
    alert(`${product.name} (${selectedColor.name}, ${selectedSize}) has been added to your cart!`);
  };

  const handleAddRelatedToCart = (relatedProduct) => {
    addToCart(relatedProduct, 1, "Default", "Default");
    alert(`${relatedProduct.name} has been added to your cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={`${product.name} - View ${selectedImage + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
              )}
              {product.isSale && (
                <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded">Sale</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square overflow-hidden rounded-md bg-gray-100 ${
                  selectedImage === index ? "ring-2 ring-emerald-600" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : i < product.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-sm text-gray-500">SKU: PRD-{product.id.toString().padStart(5, "0")}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            )}
            {product.isSale && (
              <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className={`h-10 w-10 rounded-full border-2 ${
                      selectedColor.name === color.name ? "border-emerald-600" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color.name} color`}
                  >
                    {selectedColor.name === color.name && (
                      <Check className={`h-5 w-5 mx-auto ${color.name === "White" ? "text-black" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">Selected: {selectedColor.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`h-10 min-w-[2.5rem] px-3 rounded-md border ${
                      selectedSize === size
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <Link to="#size-guide" className="text-sm text-emerald-600 hover:underline mt-2 inline-block">
                Size Guide
              </Link>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  className="h-10 w-10 flex items-center justify-center border border-r-0 rounded-l-md"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </button>
                <div className="h-10 px-4 flex items-center justify-center border-y border-gray-300 min-w-[3rem]">
                  {quantity}
                </div>
                <button
                  className="h-10 w-10 flex items-center justify-center border border-l-0 rounded-r-md"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </button>
                <span className="ml-4 text-sm text-gray-500">{product.stock} available</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium flex-1 flex items-center justify-center"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            <button className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-md font-medium flex-1 flex items-center justify-center">
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium">Free Shipping</h4>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-start">
              <RotateCcw className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium">Free Returns</h4>
                <p className="text-xs text-gray-500">Within 30 days</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium">Secure Payment</h4>
                <p className="text-xs text-gray-500">Encrypted transactions</p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b">
          <div className="flex -mb-px">
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "description"
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "details"
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "reviews"
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>
        </div>

        <div className="pt-6">
          {activeTab === "description" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">About the Product</h3>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <h4 className="font-medium mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-emerald-600 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="https://cart-mart.netlify.app/img/products/f7.jpg"
                  alt="Product lifestyle"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="border-b pb-2">
                  <h4 className="text-sm text-gray-500">Material</h4>
                  <p>{product.details.material}</p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="text-sm text-gray-500">Fit</h4>
                  <p>{product.details.fit}</p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="text-sm text-gray-500">Care</h4>
                  <p>{product.details.care}</p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="text-sm text-gray-500">Origin</h4>
                  <p>{product.details.origin}</p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="text-sm text-gray-500">Brand</h4>
                  <p>{product.brand}</p>
                </div>
                <div className="border-b pb-2">
                  <h4 className="text-sm text-gray-500">Category</h4>
                  <p>{product.category}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
              <p className="text-gray-600 mb-6">No reviews yet. Be the first to review this product.</p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <Link to="/products" className="text-emerald-600 hover:underline font-medium">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="group bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
            >
              <Link to={`/products/${relatedProduct.slug}`} className="block aspect-square overflow-hidden">
                <img
                  src={relatedProduct.image || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="p-4">
                <Link to={`/products/${relatedProduct.slug}`} className="block">
                  <h3 className="font-medium mb-1 hover:text-emerald-600 transition-colors">{relatedProduct.name}</h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">${relatedProduct.price}</span>
                  <button
                    className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    onClick={() => handleAddRelatedToCart(relatedProduct)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">Add to cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
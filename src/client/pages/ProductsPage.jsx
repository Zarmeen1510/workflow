"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Filter, X, ChevronDown, SlidersHorizontal, Grid, List } from "lucide-react";
import { useCart } from "../context/CartContext";

// Mock product data
const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviewCount: 120,
    image: "https://cart-mart.netlify.app/img/products/n8.jpg",
    isNew: true,
    isSale: true,
    slug: "premium-cotton-t-shirt",
    category: "Clothing",
    colors: ["Black", "White", "Gray"],
    brand: "FashionBrand",
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 85,
    image: "https://cart-mart.netlify.app/img/products/n2.jpg",
    isNew: true,
    isSale: false,
    slug: "slim-fit-jeans",
    category: "Clothing",
    colors: ["Blue", "Black"],
    brand: "DenimCo",
  },
  {
    id: 3,
    name: "Leather Crossbody Bag",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviewCount: 64,
    image: "https://cart-mart.netlify.app/img/products/n5.jpg",
    isNew: false,
    isSale: true,
    slug: "leather-crossbody-bag",
    category: "Accessories",
    colors: ["Brown", "Black", "Tan"],
    brand: "LuxLeather",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.9,
    reviewCount: 210,
    image: "https://cart-mart.netlify.app/img/shop/23.jpg",
    isNew: false,
    isSale: true,
    slug: "wireless-headphones",
    category: "Electronics",
    colors: ["Black", "Silver", "Rose Gold"],
    brand: "SoundTech",
  },
  {
    id: 5,
    name: "Smart Watch",
    price: 199.99,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 178,
    image: "https://cart-mart.netlify.app/img/shop/10.jpg",
    isNew: true,
    isSale: false,
    slug: "smart-watch",
    category: "Electronics",
    colors: ["Black", "Silver"],
    brand: "TechGear",
  },
  {
    id: 6,
    name: "Running Shoes",
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.4,
    reviewCount: 156,
    image: "https://cart-mart.netlify.app/img/shop/14.jpg",
    isNew: false,
    isSale: true,
    slug: "running-shoes",
    category: "Footwear",
    colors: ["Blue", "Black", "Red"],
    brand: "SportStep",
  },
];

// Filter options
const categories = [
  { id: "clothing", label: "Clothing" },
  { id: "footwear", label: "Footwear" },
  { id: "accessories", label: "Accessories" },
  { id: "electronics", label: "Electronics" },
];

const colors = [
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
  { id: "gray", label: "Gray" },
  { id: "blue", label: "Blue" },
  { id: "brown", label: "Brown" },
  { id: "red", label: "Red" },
  { id: "silver", label: "Silver" },
];

const brands = [
  { id: "fashionbrand", label: "FashionBrand" },
  { id: "denimco", label: "DenimCo" },
  { id: "luxleather", label: "LuxLeather" },
  { id: "soundtech", label: "SoundTech" },
  { id: "techgear", label: "TechGear" },
  { id: "sportstep", label: "SportStep" },
];

const ProductsPage = () => {
  const { addToCart } = useCart(); // Access addToCart from CartContext
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [colorSelections, setColorSelections] = useState({}); // Track selected color for each product

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Filter by price
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category.toLowerCase()));
    }

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter((product) => product.colors.some((color) => selectedColors.includes(color.toLowerCase())));
    }

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand.toLowerCase()));
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(result);
  }, [priceRange, selectedCategories, selectedColors, selectedBrands, sortOption]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleColor = (colorId) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]));
  };

  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]));
  };

  const clearAllFilters = () => {
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSortOption("featured");
    setColorSelections({});
  };

  const hasActiveFilters = () => {
    return (
      selectedCategories.length > 0 ||
      selectedColors.length > 0 ||
      selectedBrands.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 200
    );
  };

  const handleAddToCart = (product, color) => {
    if (!color) {
      alert("Please select a color before adding to cart.");
      return;
    }
    addToCart(product, 1, color, "Default"); // Add product with quantity 1, selected color, and default size
  };

  const handleColorSelect = (productId, color) => {
    setColorSelections((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Products</span>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded-md"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>

        <div className="flex items-center gap-2">
          <select
            className="px-2 py-2 border rounded-md"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="rating">Top Rated</option>
          </select>

          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`h-9 w-9 flex items-center justify-center ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </button>
            <button
              className={`h-9 w-9 flex items-center justify-center ${viewMode === "list" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute top-0 left-0 h-full w-[300px] bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Mobile Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Categories */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <label htmlFor={`mobile-category-${category.id}`} className="text-sm">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Colors */}
              <div>
                <h3 className="font-medium mb-3">Colors</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`mobile-color-${color.id}`}
                        checked={selectedColors.includes(color.id)}
                        onChange={() => toggleColor(color.id)}
                      />
                      <label htmlFor={`mobile-color-${color.id}`} className="text-sm">
                        {color.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div>
                <h3 className="font-medium mb-3">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`mobile-brand-${brand.id}`}
                        checked={selectedBrands.includes(brand.id.toLowerCase())}
                        onChange={() => toggleBrand(brand.id.toLowerCase())}
                      />
                      <label htmlFor={`mobile-brand-${brand.id}`} className="text-sm">
                        {brand.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  className="w-full px-4 py-2 border rounded-md mb-2"
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                >
                  Clear All Filters
                </button>
                <button
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-full md:w-64 lg:w-72 shrink-0">
          <div className="space-y-6">
            {/* Active Filters */}
            {hasActiveFilters() && (
              <div className="pb-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Active Filters</h3>
                  <button className="text-xs text-gray-500" onClick={clearAllFilters}>
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((cat) => {
                    const category = categories.find((c) => c.id === cat);
                    return category ? (
                      <div
                        key={`cat-${cat}`}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        {category.label}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
                      </div>
                    ) : null;
                  })}

                  {selectedColors.map((col) => {
                    const color = colors.find((c) => c.id === col);
                    return color ? (
                      <div
                        key={`col-${col}`}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        {color.label}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleColor(col)} />
                      </div>
                    ) : null;
                  })}

                  {selectedBrands.map((br) => {
                    const brand = brands.find((b) => b.id.toLowerCase() === br);
                    return brand ? (
                      <div
                        key={`br-${br}`}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        {brand.label}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleBrand(br)} />
                      </div>
                    ) : null;
                  })}

                  {(priceRange[0] > 0 || priceRange[1] < 200) && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm">
                      ${priceRange[0]} - ${priceRange[1]}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 200])} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="pb-6 border-b">
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="w-full mb-6"
                />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="pb-6 border-b">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm">
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="pb-6 border-b">
              <h3 className="font-medium mb-3">Colors</h3>
              <div className="space-y-2">
                {colors.map((color) => (
                  <div key={color.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`color-${color.id}`}
                      checked={selectedColors.includes(color.id)}
                      onChange={() => toggleColor(color.id)}
                    />
                    <label htmlFor={`color-${color.id}`} className="text-sm">
                      {color.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="pb-6 border-b">
              <h3 className="font-medium mb-3">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id.toLowerCase())}
                      onChange={() => toggleBrand(brand.id.toLowerCase())}
                    />
                    <label htmlFor={`brand-${brand.id}`} className="text-sm">
                      {brand.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop Sort and View Controls */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm text-gray-500 mr-2">{filteredProducts.length} products</span>
              {hasActiveFilters() && (
                <button className="text-xs text-gray-500" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <select
                className="px-4 py-2 border rounded-md"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>

              <div className="flex border rounded-md overflow-hidden">
                <button
                  className={`h-9 w-9 flex items-center justify-center ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </button>
                <button
                  className={`h-9 w-9 flex items-center justify-center ${viewMode === "list" ? "bg-gray-100" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <X className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-md" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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

                    {/* Product badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
                      )}
                      {product.isSale && (
                        <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded">Sale</span>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="absolute top-2 right-2">
                      <button className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to wishlist</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <Link to={`/products/${product.slug}`} className="block">
                      <h3 className="font-medium text-lg mb-1 hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
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

                    {/* Color Selection */}
                    <div className="flex gap-2 mb-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          className={`h-6 w-6 rounded-full border ${
                            colorSelections[product.id] === color ? "border-emerald-600" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => handleColorSelect(product.id, color)}
                          title={color}
                        />
                      ))}
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                        onClick={() => handleAddToCart(product, colorSelections[product.id])}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow p-4"
                >
                  <div className="relative w-full sm:w-48 h-48">
                    <Link to={`/products/${product.slug}`} className="block h-full w-full">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </Link>

                    {/* Product badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
                      )}
                      {product.isSale && (
                        <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded">Sale</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <Link to={`/products/${product.slug}`} className="block">
                      <h3 className="font-medium text-lg mb-1 hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
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

                    <p className="text-gray-500 mb-4">
                      {product.category} • {product.brand} • {product.colors.join(", ")}
                    </p>

                    {/* Color Selection */}
                    <div className="flex gap-2 mb-4">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          className={`h-6 w-6 rounded-full border ${
                            colorSelections[product.id] === color ? "border-emerald-600" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => handleColorSelect(product.id, color)}
                          title={color}
                        />
                      ))}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 border rounded-md flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist
                        </button>
                        <button
                          className="px-3 py-1 bg-emerald-600 text-white rounded-md flex items-center"
                          onClick={() => handleAddToCart(product, colorSelections[product.id])}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button className="h-8 w-8 flex items-center justify-center border rounded-md opacity-50 cursor-not-allowed">
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">
                1
              </button>
              <button className="h-8 w-8 flex items-center justify-center border rounded-md">2</button>
              <button className="h-8 w-8 flex items-center justify-center border rounded-md">3</button>
              <button className="h-8 w-8 flex items-center justify-center border rounded-md">
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
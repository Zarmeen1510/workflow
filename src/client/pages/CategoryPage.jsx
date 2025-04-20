"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])

  const categoryName = slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Category"

  useEffect(() => {
    const mockProducts = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `${categoryName} Product ${i + 1}`,
      price: Math.floor(Math.random() * 100) + 10,
      image: `https://cart-mart.netlify.app/img/products/f1.jpg`,
    }))
    setProducts(mockProducts)
  }, [slug])

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">{categoryName}</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-lg aspect-square bg-muted mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-primary font-medium">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

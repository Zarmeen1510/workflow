"use client"

import { ShoppingBag, ShoppingCart, Users, CastleIcon as ChessKnight } from "lucide-react"

export default function Sidebar({ activeTab, setActiveTab, user }) {
  const menuItems = [
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users, adminOnly: true },
    
  ]

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold">E-Commerce Dashboard</h1>
      </div>
      <nav className="mt-5">
        <ul>
          {menuItems.map((item) => {
            // Skip admin-only items for non-admin users
            if (item.adminOnly && user.role !== "admin") return null

            return (
              <li key={item.id} className="px-2">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-4 py-2 mt-1 text-sm rounded-lg ${
                    activeTab === item.id
                      ? "bg-gray-700 text-gray-100"
                      : "hover:bg-gray-700 text-gray-300 hover:text-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

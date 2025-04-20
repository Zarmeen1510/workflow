"use client"

import { useState } from "react"
import { Bell, Menu, X, User } from "lucide-react"

export default function Topbar({ user, onLogout }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="flex-1 flex justify-end items-center">
          <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2">
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="hidden md:block font-medium">{user.name}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-500">{user.email}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden bg-gray-800 text-white">
          <nav className="px-2 pt-2 pb-4">
            <a href="/adminproducts" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Products
            </a>
            <a href="/adminorder" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Orders
            </a>
            {user.role === "admin" && (
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                Users
              </a>
            )}
            
          </nav>
        </div>
      )}
    </header>
  )
}

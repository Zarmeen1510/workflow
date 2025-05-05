"use client"

import { useState } from "react"
import Sidebar from "./admin/sidebar"
import Topbar from "./admin/topbar"
import Products from "./admin/products"
import Orders from "./admin/orders"
import Users from "./admin/users"
import Chess from "./chess"

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("products")

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products />
      case "orders":
        return <Orders />
      case "users":
        return user.role === "admin" ? (
          <Users />
        ) : (
          <div className="p-4">You don't have permission to view this page</div>
        )
      case "chess":
        return <Chess />
      default:
        return <Products />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4">{renderContent()}</main>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Eye, Clock, CheckCircle, XCircle, TruckIcon } from "lucide-react"
import Swal from "sweetalert2"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(storedOrders)

    // Initialize with sample data if empty
    if (storedOrders.length === 0) {
      const sampleOrders = [
        {
          id: "1",
          customer: "John Doe",
          email: "john@example.com",
          date: "2023-04-15T10:30:00Z",
          status: "delivered",
          total: 1299.98,
          items: [
            { id: "1", name: "Smartphone X", price: 999.99, quantity: 1 },
            { id: "3", name: "Wireless Headphones", price: 199.99, quantity: 1.5 },
          ],
        },
        {
          id: "2",
          customer: "Jane Smith",
          email: "jane@example.com",
          date: "2023-04-16T14:20:00Z",
          status: "processing",
          total: 1499.99,
          items: [{ id: "2", name: "Laptop Pro", price: 1499.99, quantity: 1 }],
        },
        {
          id: "3",
          customer: "Bob Johnson",
          email: "bob@example.com",
          date: "2023-04-17T09:15:00Z",
          status: "shipped",
          total: 399.98,
          items: [{ id: "3", name: "Wireless Headphones", price: 199.99, quantity: 2 }],
        },
      ]
      setOrders(sampleOrders)
      localStorage.setItem("orders", JSON.stringify(sampleOrders))
    }
  }, [])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus }
      }
      return order
    })

    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // If we're updating the currently selected order, update that too
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }

    Swal.fire({
      icon: "success",
      title: "Order Updated",
      text: `Order #${orderId} status changed to ${newStatus}`,
      timer: 1500,
      showConfirmButton: false,
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
      case "processing":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Processing</span>
      case "shipped":
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Shipped</span>
      case "delivered":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Delivered</span>
      case "cancelled":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Orders</h2>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(order.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order #{selectedOrder.id}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-semibold">Customer</h4>
                  <p>{selectedOrder.customer}</p>
                  <p>{selectedOrder.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Order Date</h4>
                  <p>{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Items</h4>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right font-bold">
                      Total:
                    </td>
                    <td className="px-4 py-2 font-bold">${selectedOrder.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Update Status</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "processing")}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md flex items-center text-sm"
                >
                  <Clock className="w-4 h-4 mr-1" /> Processing
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "shipped")}
                  className="px-3 py-1 bg-purple-500 text-white rounded-md flex items-center text-sm"
                >
                  <TruckIcon className="w-4 h-4 mr-1" /> Shipped
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                  className="px-3 py-1 bg-green-500 text-white rounded-md flex items-center text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Delivered
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                  className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center text-sm"
                >
                  <XCircle className="w-4 h-4 mr-1" /> Cancelled
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Package,
  MapPin,
  Phone,
  User,
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Box,
  AlertCircle,
  CheckCheck,
  AlertTriangle
} from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const statusConfig = {
    confirmed: {
      icon: CheckCircle,
      color: "bg-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-500",
      label: "Confirmed",
    },
    cancelled: {
      icon: XCircle,
      color: "bg-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-500",
      label: "Cancelled",
    },
    pending: {
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-500",
      label: "Pending",
    },
    completed: {
      icon: CheckCheck,
      color: "bg-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-500",
      label: "Completed",
    },
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await api.patch(`/bookings/${selectedBookingId}/cancel`, { reason: "Cancelled by User" });
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      setSelectedBookingId(null);
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
      setShowCancelModal(false);
      setSelectedBookingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (selectedStatus === "All") return true;
    return booking.status === selectedStatus.toLowerCase();
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
                <div className="loading-spinner"></div>   
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
         
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}     
        <div className="text-center mb-12">
                 
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-white pb-3">
                        My Orders        
          </h1>
                 
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        Track and manage your product bookings        
          </p>
                 
          <div className="mt-8 h-1 w-32 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 mx-auto rounded-full"></div>
               
        </div>
                {/* Status Filter - MODIFIED HERE */}     
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
                 
          {["All", "Confirmed", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedStatus === status
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
              }`}
            >
                            {status}         
            </button>
          ))}
               
        </div>
                {/* Orders List */}     
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
                     
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />       
                <p className="text-gray-400 text-xl mb-2">No orders found</p>   
                 
            <p className="text-gray-500 mb-6">
                         
              {selectedStatus !== "All"
                ? `You don't have any ${selectedStatus.toLowerCase()} orders`
                : "Start shopping to see your orders here"}
                       
            </p>
                     
            <button
              onClick={() => navigate("/products")}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg"
            >
                            Browse Products          
            </button>
                   
          </div>
        ) : (
          <div className="space-y-6">
                     
            {filteredBookings.map((booking) => {
              // If other statuses like 'pending', 'shipped', etc., exist in the data,
              // they will fall back to AlertCircle or the default 'pending' style.
              const StatusIcon =
                statusConfig[booking.status]?.icon || AlertCircle;
              const statusStyle =
                statusConfig[booking.status] || statusConfig.pending;
              const isCompleted = booking.status === "completed";
              const isCancelled = booking.status === "cancelled";

              return (
                <div
                  key={booking._id}
                  className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                                 
                  <div className="p-6 md:p-8">
                                        {/* Order Header */}                 
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-white/10">
                                         
                      <div className="mb-4 md:mb-0">
                                             
                        <div className="flex items-center gap-3 mb-2">
                                                 
                          <Package className="w-6 h-6 text-red-400" />         
                                       
                          <h3 className="text-xl font-bold text-white">
                                                        Order #
                            {booking._id.slice(-8).toUpperCase()}               
                                   
                          </h3>
                                               
                        </div>
                                             
                        <p className="text-gray-400 text-sm">
                                                    Placed on{" "}
                          {formatDateTime(booking.orderDate)}                   
                           
                        </p>
                                           
                      </div>
                                         
                      <div
                        className={`flex items-center gap-2 px-4 py-2 ${statusStyle.bgColor} ${statusStyle.borderColor} border rounded-full`}
                      >
                                             
                        <StatusIcon
                          className={`w-5 h-5 ${statusStyle.textColor}`}
                        />
                                             
                        <span
                          className={`font-semibold ${statusStyle.textColor}`}
                        >
                                                    {statusStyle.label}         
                                     
                        </span>
                                           
                      </div>
                                       
                    </div>
                                        {/* Product Details & Total Amount */} 
                                   
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                         
                      {/* Product Image & Info (Now takes up 2/3 or full width depending on screen size) */}
                                         
                      <div className="lg:col-span-2">
                                             
                        <div className="flex gap-4">
                                                 
                          <img
                            src={booking.productImage}
                            alt={booking.productName}
                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border-2 border-white/10"
                          />
                                                 
                          <div className="flex-1">
                                                     
                            <h4 className="text-lg md:text-xl font-bold text-white mb-2">
                                                         {booking.productName} 
                                                     
                            </h4>
                                                     
                            <p className="text-gray-400 text-sm mb-2">
                                                            Category:{" "}
                              {booking.productCategory}                         
                            </p>
                                                     
                            <div className="flex items-center gap-3 text-sm">
                                                         
                              <span className="text-gray-500 line-through">
                                                                ₹
                                {booking.strikePrice.toLocaleString()}         
                                                 
                              </span>
                                                         
                              <span className="text-white font-bold text-lg">
                                                                ₹
                                {booking.sellingPrice.toLocaleString()}         
                                                 
                              </span>
                                                         
                              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                             
                                {booking.discountPercentage}% OFF              
                                             
                              </span>
                                                       
                            </div>
                                                     
                            <p className="text-gray-400 text-sm mt-2">
                                                            Quantity:{" "}
                              {booking.quantity} × ₹
                              {booking.sellingPrice.toLocaleString()}           
                                           
                            </p>
                                                   
                          </div>
                                               
                        </div>
                                           
                      </div>
                                         
                      {/* Total Amount (Stays as 1/3 width) */}                 
                       
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                                             
                        <p className="text-gray-400 text-sm mb-1">
                          Total Amount
                        </p>
                                             
                        <p className="text-white font-bold text-3xl">
                                                    ₹
                          {booking.totalAmount.toLocaleString()}               
                               
                        </p>
                                             
                        <p className="text-green-400 text-sm mt-1">
                                                    Saved ₹
                          {(
                            booking.strikePrice * booking.quantity -
                            booking.totalAmount
                          ).toLocaleString()}
                                               
                        </p>
                                           
                      </div>
                                       
                    </div>
                                     
                    {/* Coupon Code Section - Updated for completed and cancelled */}
                                     
                    {booking.couponCode && (
                      <div className={`bg-gradient-to-r rounded-xl p-6 border-2 mb-6 transition-all duration-300 ${
                        isCompleted 
                          ? "from-gray-500/5 via-gray-500/5 to-gray-500/5 border-gray-500/20" 
                          : isCancelled
                          ? "from-red-500/5 via-red-500/5 to-red-500/5 border-red-500/20"
                          : "from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/30"
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${
                              isCompleted ? "bg-gray-500/20" : 
                              isCancelled ? "bg-red-500/20" : 
                              "bg-yellow-500/20"
                            }`}>
                              <Ticket className={`w-6 h-6 ${
                                isCompleted ? "text-gray-400" : 
                                isCancelled ? "text-red-400" : 
                                "text-yellow-400"
                              }`} />    
                            </div>
                            <div>
                              <p className={`text-sm ${
                                isCompleted ? "text-gray-500" : 
                                isCancelled ? "text-red-400/70" : 
                                "text-gray-400"
                              }`}>
                                Unique Coupon Code
                              </p>
                              <p className={`font-mono text-xl md:text-2xl font-bold tracking-wider ${
                                isCompleted 
                                  ? "text-gray-500 line-through opacity-50" 
                                  : isCancelled
                                  ? "text-red-400 line-through opacity-60"
                                  : "text-white"
                              }`}>
                                {booking.couponCode}    
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(booking.couponCode);
                              toast.success("Coupon code copied!");
                            }}
                            disabled={isCompleted || isCancelled}
                            className={`px-6 py-2 font-bold rounded-full transition-colors whitespace-nowrap ${
                              isCompleted
                                ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                                : isCancelled
                                ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                                : "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                            }`}
                          >
                            {isCompleted ? "Used" : isCancelled ? "Cancelled" : "Copy Code"}
                          </button>
                        </div>
                        <p className={`text-xs mt-3 ${
                          isCompleted ? "text-gray-600" : 
                          isCancelled ? "text-red-400/60" : 
                          "text-gray-400"
                        }`}>
                          {isCompleted 
                            ? "✅ This coupon has been used for a completed order." 
                            : isCancelled
                            ? "❌ This order has been cancelled."
                            : "💡 Use this coupon code at shop for getting discount"
                          }
                        </p>
                      </div>
                    )}
                       {/* Action Buttons */}                 
                    {booking.status !== "completed" &&
                      booking.status !== "cancelled" && (
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 font-medium rounded-full hover:bg-red-500/30 transition-colors"
                          >
                              Cancel Order              
                          </button>
                          <button
                            onClick={() => navigate("/contact")}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-full hover:from-indigo-500 hover:to-blue-500 transition-all duration-300"
                          >
                             Contact Support          
                          </button>
                        </div>
                      )}

                    {/* Completed Order Message */}
                    {booking.status === "completed" && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                        <CheckCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-green-400 font-semibold">Order Completed</p>
                          <p className="text-gray-400 text-sm">
                            Completed on {formatDateTime(booking.completedAt || booking.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Cancelled Order Message */}
                    {booking.status === "cancelled" && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-red-400 font-semibold">Order Cancelled</p>
                          <p className="text-gray-400 text-sm">
                            {booking.cancellationReason || "Cancelled by User"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal for Cancel */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl animate-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Cancellation</h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Once you cancel this order, <span className="text-red-400 font-semibold">you cannot reverse this action</span>. The order status will be permanently changed to cancelled.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBookingId(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-500/20 text-gray-300 border border-gray-500/30 font-semibold rounded-xl hover:bg-gray-500/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancelBooking}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
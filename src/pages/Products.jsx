import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Search,
  Filter,
  ShoppingCart,
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  Package,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

// Image Slider Component with Swipe Support
const ImageSlider = ({ images, productName, isModal = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={`w-full ${isModal ? 'h-24' : 'h-44'} bg-slate-700 rounded-lg flex items-center justify-center text-gray-400`}>
        <ImageIcon className="w-10 h-10 mr-2" /> No Image
      </div>
    );
  }

  return (
    <div className={`relative w-full ${isModal ? 'h-24' : 'h-44'} rounded-lg overflow-hidden group`}>
      {/* Main Image */}
      <div
        className="w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} - ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Navigation Buttons - Show only if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className={isModal ? 'w-3 h-3' : 'w-5 h-5'} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            aria-label="Next image"
          >
            <ChevronRight className={isModal ? 'w-3 h-3' : 'w-5 h-5'} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-200 rounded-full ${
                  index === currentIndex
                    ? "bg-white w-6 h-2"
                    : "bg-white/50 hover:bg-white/75 w-2 h-2"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    quantity: 1,
    bookingDate: "",
  });

  const categories = [
    "All",
    "Laptops",
    "Desktops",
    "Security",
    "Accessories",
    "Audio",
    "Networking",
    "Components",
    "Monitors",
    "Storage",
    "Gaming",
  ];
  const conditions = ["All", "New", "Excellent", "Very Good", "Good", "Fair"];

  const categoryColors = {
    Laptops: "bg-blue-500 hover:bg-blue-600",
    Desktops: "bg-green-500 hover:bg-green-600",
    Security: "bg-red-500 hover:bg-red-600",
    Accessories: "bg-purple-500 hover:bg-purple-600",
    Audio: "bg-pink-500 hover:bg-pink-600",
    Networking: "bg-indigo-500 hover:bg-indigo-600",
    Components: "bg-yellow-500 hover:bg-yellow-600",
    Monitors: "bg-teal-500 hover:bg-teal-600",
    Storage: "bg-orange-500 hover:bg-orange-600",
    Gaming: "bg-violet-500 hover:bg-violet-600",
  };

  const conditionColors = {
    New: "bg-green-100 text-green-800",
    Excellent: "bg-blue-100 text-blue-800",
    "Very Good": "bg-emerald-100 text-emerald-800",
    Good: "bg-yellow-100 text-yellow-800",
    Fair: "bg-orange-100 text-orange-800",
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrices = (basePrice) => {
    if (!basePrice || basePrice === 0) {
      return {
        strikePrice: 0,
        sellingPrice: 0,
        discountPercentage: 0,
      };
    }
    const strikePrice = basePrice * 1.16;
    const sellingPrice = basePrice * 1.08;
    const discountPercentage = Math.round(
      ((strikePrice - sellingPrice) / strikePrice) * 100
    );
    return {
      strikePrice: Math.round(strikePrice),
      sellingPrice: Math.round(sellingPrice),
      discountPercentage,
    };
  };

  const handleBookNowClick = (product) => {
    if (!user) {
      toast.error("Please login to book this product");
      navigate("/login");
      return;
    }
    setSelectedProduct(product);
    setBookingData({
      customerName: user.name || "",
      customerPhone: user.phone || "",
      customerAddress: "",
      quantity: 1,
      bookingDate: "",
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (
      !bookingData.customerName ||
      !bookingData.customerPhone ||
      !bookingData.customerAddress ||
      !bookingData.bookingDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const prices = calculatePrices(selectedProduct.price || 0);
      const orderData = {
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        productImage: selectedProduct.images?.[0] || selectedProduct.image,
        productCategory: selectedProduct.category,
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        customerAddress: bookingData.customerAddress,
        quantity: bookingData.quantity,
        bookingDate: bookingData.bookingDate,
        actualPrice: selectedProduct.price || 0,
        strikePrice: prices.strikePrice,
        sellingPrice: prices.sellingPrice,
        totalAmount: prices.sellingPrice * bookingData.quantity,
        discountPercentage: prices.discountPercentage,
      };

      const response = await api.post("/bookings", orderData);
      toast.success(
        `Booking confirmed! Your coupon code: ${response.data.booking.couponCode}`
      );
      setShowBookingModal(false);
      setSelectedProduct(null);
      navigate("/orders");
    } catch (error) {
      console.error("Error placing booking:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place booking. Please try again."
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesCondition =
      selectedCondition === "All" || product.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-white pb-2">
            Tech Store Products
          </h1>
          <p className="mt-1 text-base text-gray-300">
            Quality second-hand laptops, desktops, CCTV, accessories, and spare
            parts at unbeatable prices
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-4">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex justify-center items-center px-2 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              <span>Filters</span>
            </button>
            {showFilters && (
              <div className="mt-2 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="flex flex-col gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => {
            const prices = calculatePrices(product.price || 0);
            return (
              <div
                key={product._id || index}
                className="group relative bg-gradient-to-br from-slate-800 via-slate-800 to-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden transform hover:-translate-y-3 border border-white/10"
              >
                {/* Image Slider */}
                <div className="relative overflow-hidden">
                  <ImageSlider
                    images={product.images || [product.image]}
                    productName={product.name}
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span
                      className={`px-3 py-1.5 ${
                        categoryColors[product.category] ||
                        "bg-gray-500 hover:bg-gray-600"
                      } text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border border-white/20`}
                    >
                      {product.category}
                    </span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {product.type}
                    </span>
                  </div>

                  {/* Condition Badge */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <span
                      className={`px-2.5 py-1 ${
                        conditionColors[product.condition] ||
                        "bg-gray-100 text-gray-800"
                      } text-xs font-semibold rounded-full shadow-md`}
                    >
                      {product.condition}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-md">
                      ✅ {product.availability}
                    </span>
                  </div>

                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-white to-red-300 transition-all duration-300 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed text-sm">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-200 mb-2">
                      Key Features:
                    </h4>
                    <div className="space-y-1">
                      {product.features?.slice(0, 3).map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs text-gray-300"
                        >
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
                    {prices.sellingPrice > 0 ? (
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-gray-400 text-xs line-through">
                            ₹{prices.strikePrice.toLocaleString()}
                          </p>
                          <p className="text-white font-bold text-2xl">
                            ₹{prices.sellingPrice.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {prices.discountPercentage}% OFF
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">
                          Contact for Price
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => handleBookNowClick(product)}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white text-sm font-bold rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Book Now
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 delay-200"></div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-3xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Looking for Something Specific?
          </h3>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Can't find what you need? Contact us directly and we'll help you
            find the perfect tech solution at the best price!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg text-lg">
              📞 Call Now: +91 91249 43157
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg text-lg">
              💬 WhatsApp: +91 91249 43157
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6 border-b border-white/20 flex justify-between items-center sticky top-0 bg-slate-800/95 backdrop-blur-sm z-10">
              <h2 className="text-2xl font-bold text-white">
                Book Your Product
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Product Summary with Image Slider */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <div className="flex gap-4">
                  <div className="w-24 flex-shrink-0">
                    <ImageSlider
                      images={selectedProduct.images || [selectedProduct.image]}
                      productName={selectedProduct.name}
                      isModal={true}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg mb-1 truncate">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {selectedProduct.category}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {calculatePrices(selectedProduct.price || 0)
                        .sellingPrice > 0 ? (
                        <>
                          <span className="text-gray-400 text-sm line-through">
                            ₹
                            {calculatePrices(
                              selectedProduct.price || 0
                            ).strikePrice.toLocaleString()}
                          </span>
                          <span className="text-white font-bold text-xl">
                            ₹
                            {calculatePrices(
                              selectedProduct.price || 0
                            ).sellingPrice.toLocaleString()}
                          </span>
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {
                              calculatePrices(selectedProduct.price || 0)
                                .discountPercentage
                            }
                            % OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-white font-bold text-lg">
                          Contact for Price
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.customerName}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.customerPhone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          customerPhone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address *
                  </label>
                  <textarea
                    value={bookingData.customerAddress}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        customerAddress: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your address"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      <Package className="w-4 h-4 inline mr-1" />
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={bookingData.quantity}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Booking Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.bookingDate}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          bookingDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                {/* Total Amount */}
                {calculatePrices(selectedProduct.price || 0).sellingPrice >
                  0 && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Total Amount:
                      </span>
                      <span className="text-white font-bold text-2xl">
                        ₹
                        {(
                          calculatePrices(selectedProduct.price || 0)
                            .sellingPrice * bookingData.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-600 text-white font-bold rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
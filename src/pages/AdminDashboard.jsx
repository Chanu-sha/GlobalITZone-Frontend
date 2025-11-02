// components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Package,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

// Delete Confirmation Popup Component
const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, productName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-auto border border-red-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Delete Product</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm">
            Are you sure you want to delete <span className="font-semibold text-white">"{productName}"</span>? Once deleted, this product will no longer be available to users.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Image Slider Component with Swipe Support
const ImageSlider = ({ images, productName }) => {
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
      <div className="w-full h-48 bg-slate-700 rounded-lg flex items-center justify-center text-gray-400">
        <ImageIcon className="w-10 h-10 mr-2" /> No Image
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden group">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
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
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    productId: null,
    productName: "",
    loading: false,
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    type: "",
    availability: "Available",
    price: "",
    stock: 1,
    features: [],
    images: [],
  });

  const [newFeature, setNewFeature] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
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
  const conditions = ["New", "Excellent", "Very Good", "Good", "Fair"];
  const types = [
    "Second Hand",
    "New/Refurbished",
    "Spare Parts",
    "Refurbished",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, usersRes] = await Promise.all([
        api.get("/products"),
        api.get("/users"),
      ]);

      setProducts(productsRes.data.products || []);
      setUsers(usersRes.data.users || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validation
      if (productForm.description.length < 10 || productForm.description.length > 1000) {
        toast.error("Description must be between 10 and 1000 characters");
        setSubmitting(false);
        return;
      }

      const existingImageCount = editingProduct?.images?.length || 0;
      const newImageCount = productForm.images.length;
      const totalImages = existingImageCount + newImageCount;
      
      if (editingProduct) {
        if (totalImages < 2) {
          toast.error("Please keep at least 2 images");
          setSubmitting(false);
          return;
        }
        if (totalImages > 5) {
          toast.error("Maximum 5 images allowed");
          setSubmitting(false);
          return;
        }
      } else {
        if (newImageCount < 2) {
          toast.error("Please upload at least 2 images");
          setSubmitting(false);
          return;
        }
        if (newImageCount > 5) {
          toast.error("Maximum 5 images allowed");
          setSubmitting(false);
          return;
        }
      }

      if (!productForm.name || !productForm.category || !productForm.condition || !productForm.type) {
        toast.error("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Append text fields
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("category", productForm.category);
      formData.append("condition", productForm.condition);
      formData.append("type", productForm.type);
      formData.append("availability", productForm.availability);
      if (productForm.price) formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);

      // Append features
      productForm.features.forEach((feature) => {
        if (feature && typeof feature === "string") {
          formData.append("features", feature.trim());
        }
      });

      // Append new images
      productForm.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });

      // For editing: Send existing image public IDs to keep
      if (editingProduct && editingProduct.imagePublicIds) {
        editingProduct.imagePublicIds.forEach((id) => {
          formData.append("existingImagePublicIds", id);
        });
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, config);
        toast.success("Product updated successfully!");
      } else {
        await api.post("/products", formData, config);
        toast.success("Product added successfully!");
      }

      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const resetProductForm = () => {
    // Cleanup old previews
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    
    setProductForm({
      name: "",
      description: "",
      category: "",
      condition: "",
      type: "",
      availability: "Available",
      price: "",
      stock: 1,
      features: [],
      images: [],
    });
    setImagePreviews([]);
  };

  // Open delete confirmation popup
  const openDeleteConfirmation = (productId, productName) => {
    setDeleteConfirmation({
      isOpen: true,
      productId,
      productName,
      loading: false,
    });
  };

  // Close delete confirmation popup
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      productId: null,
      productName: "",
      loading: false,
    });
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    setDeleteConfirmation(prev => ({ ...prev, loading: true }));

    try {
      await api.delete(`/products/${deleteConfirmation.productId}`);
      setProducts(products.filter((p) => p._id !== deleteConfirmation.productId));
      toast.success("Product deleted successfully");
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      setDeleteConfirmation(prev => ({ ...prev, loading: false }));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      condition: product.condition,
      type: product.type,
      availability: product.availability,
      price: product.price || "",
      stock: product.stock || 1,
      features: Array.isArray(product.features) ? product.features : [],
      images: [],
    });
    setImagePreviews([]);
    setShowProductForm(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setProductForm({
        ...productForm,
        features: [...productForm.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setProductForm({
      ...productForm,
      features: productForm.features.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const existingCount = editingProduct?.images?.length || 0;
    const totalCount = existingCount + files.length;

    if (totalCount > 5) {
      toast.error(`Maximum 5 images allowed. You can add ${5 - existingCount} more.`);
      e.target.value = null;
      return;
    }

    if (!editingProduct && files.length < 2) {
      toast.error("Please select at least 2 images");
      e.target.value = null;
      return;
    }

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
    setProductForm((prev) => ({ ...prev, images: files }));
  };

  const removeNewImage = (index) => {
    const newImages = Array.from(productForm.images);
    const newPreviews = [...imagePreviews];
    
    // Revoke URL to prevent memory leak
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setProductForm((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (index) => {
    if (!editingProduct) return;

    const updatedImages = [...editingProduct.images];
    const updatedPublicIds = [...editingProduct.imagePublicIds];
    
    updatedImages.splice(index, 1);
    updatedPublicIds.splice(index, 1);

    const totalRemaining = updatedImages.length + productForm.images.length;
    
    if (totalRemaining < 2) {
      toast.error("You must keep at least 2 images");
      return;
    }

    setEditingProduct((prev) => ({
      ...prev,
      images: updatedImages,
      imagePublicIds: updatedPublicIds,
    }));
    
    toast.success("Image will be removed when you save");
  };

  const stats = [
    {
      name: "Total Products",
      value: products.length,
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Total Users",
      value: users.length,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
  ];

  if (loading && !showProductForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-3 sm:px-4 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Manage your tech store</p>
        </div>

        {/* Stats - Side by side on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8 md:mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20"
              >
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-2 md:mb-4`}
                >
                  <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">{stat.name}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 md:mb-8 bg-white/10 backdrop-blur-md rounded-lg p-1">
          {[
            { id: "products", name: "Products" },
            { id: "users", name: "Users" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-md font-medium transition-colors text-sm md:text-base ${
                activeTab === tab.id
                  ? "bg-red-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Products Management
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetProductForm();
                  setShowProductForm(true);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm md:text-base">Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20"
                >
                  {/* Image Slider */}
                  <div className="mb-3 md:mb-4">
                    <ImageSlider
                      images={product.images}
                      productName={product.name}
                    />
                  </div>

                  <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      {product.category}
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {product.condition}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 flex items-center justify-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteConfirmation(product._id, product.name)}
                      className="flex-1 flex items-center justify-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
              Users Management
            </h2>
            <div className="space-y-3 md:space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-white">
                        {user.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        user.role === "admin" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Form Modal - Mobile Optimized */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-0 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-slate-800 rounded-none sm:rounded-2xl p-4 sm:p-6 md:p-8 w-full min-h-screen sm:min-h-0 sm:max-w-2xl sm:my-8 sm:max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <div>
                    <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                      required
                      disabled={submitting}
                    >
                      <option value="" className="bg-slate-800">
                        Select Category
                      </option>
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-slate-800"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                    Description *
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                    rows="3"
                    minLength="10"
                    maxLength="1000"
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {productForm.description.length}/1000 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                      Condition *
                    </label>
                    <select
                      value={productForm.condition}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          condition: e.target.value,
                        })
                      }
                      className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                      required
                      disabled={submitting}
                    >
                      <option value="" className="bg-slate-800">
                        Select Condition
                      </option>
                      {conditions.map((condition) => (
                        <option
                          key={condition}
                          value={condition}
                          className="bg-slate-800"
                        >
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                      Type *
                    </label>
                    <select
                      value={productForm.type}
                      onChange={(e) =>
                        setProductForm({ ...productForm, type: e.target.value })
                      }
                      className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                      required
                      disabled={submitting}
                    >
                      <option value="" className="bg-slate-800">
                        Select Type
                      </option>
                      {types.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-slate-800"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                      Availability
                    </label>
                    <select
                      value={productForm.availability}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          availability: e.target.value,
                        })
                      }
                      className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                      disabled={submitting}
                    >
                      <option value="Available" className="bg-slate-800">
                        Available
                      </option>
                      <option value="Out of Stock" className="bg-slate-800">
                        Out of Stock
                      </option>
                      <option value="Discontinued" className="bg-slate-800">
                        Discontinued
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                    Features
                  </label>
                  <div className="space-y-2">
                    {productForm.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 text-white bg-white/5 px-2 md:px-3 py-1 md:py-2 rounded-lg text-sm">
                          {feature}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-400 hover:text-red-300 p-1 md:p-2"
                          disabled={submitting}
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                        placeholder="Add a feature..."
                        className="flex-1 p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-3 md:px-4 py-2 md:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        disabled={submitting}
                      >
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-white font-medium mb-1 md:mb-2 text-sm md:text-base">
                    <ImageIcon className="w-3 h-3 md:w-4 md:h-4 inline mr-1 md:mr-2" />
                    Product Images * (Min: 2, Max: 5)
                  </label>

                  {/* Existing Images */}
                  {editingProduct &&
                    editingProduct.images &&
                    editingProduct.images.length > 0 && (
                      <div className="mb-3 md:mb-4 p-3 md:p-4 border border-yellow-500/50 rounded-lg bg-yellow-900/20">
                        <p className="text-xs md:text-sm text-yellow-300 mb-2 md:mb-3">
                          Current Images ({editingProduct.images.length})
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                          {editingProduct.images.map((imgUrl, index) => (
                            <div key={`existing-${index}`} className="relative group">
                              <img
                                src={imgUrl}
                                alt={`Existing ${index + 1}`}
                                className="w-full h-16 md:h-20 object-cover rounded-lg border border-white/20"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-600 text-white rounded-full p-0.5 md:p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Remove this image"
                                disabled={submitting}
                              >
                                <X className="w-2 h-2 md:w-3 md:h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* New Images Preview */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-3 md:mb-4 p-3 md:p-4 border border-green-500/50 rounded-lg bg-green-900/20">
                      <p className="text-xs md:text-sm text-green-300 mb-2 md:mb-3">
                        New Images ({imagePreviews.length})
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img
                              src={preview}
                              alt={`New ${index + 1}`}
                              className="w-full h-16 md:h-20 object-cover rounded-lg border border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-600 text-white rounded-full p-0.5 md:p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              title="Remove this image"
                              disabled={submitting}
                            >
                              <X className="w-2 h-2 md:w-3 md:h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 md:p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-2 file:py-1 file:px-2 md:file:py-2 md:file:px-4 file:rounded-lg file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 text-sm md:text-base"
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-400 mt-1 md:mt-2">
                    {editingProduct
                      ? `Total: ${(editingProduct.images?.length || 0) + productForm.images.length}/5 images`
                      : `Selected: ${productForm.images.length}/5 images (minimum 2 required)`}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 pt-4 md:pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      resetProductForm();
                    }}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm md:text-base order-2 sm:order-1"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 md:px-6 py-2 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 min-w-[120px] md:min-w-[140px] text-sm md:text-base order-1 sm:order-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                        <span>{editingProduct ? "Updating..." : "Adding..."}</span>
                      </>
                    ) : (
                      <span>{editingProduct ? "Update Product" : "Add Product"}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        <DeleteConfirmationPopup
          isOpen={deleteConfirmation.isOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteProduct}
          productName={deleteConfirmation.productName}
          loading={deleteConfirmation.loading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
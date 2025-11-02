// src/components/OrderModal.jsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react"; // Requires @headlessui/react
import toast from "react-hot-toast";

const OrderModal = ({ open, onClose, product, user, onOrderPlaced }) => {
  const [quantity, setQuantity] = useState(1);
  const [store, setStore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    try {
      // Call your backend API to place order
      const result = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          store
        })
      });
      if (!result.ok) throw new Error("Order failed");
      toast.success("Order placed!");
      onOrderPlaced();
      onClose();
    } catch (err) {
      toast.error("Order could not be placed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">Book Product</h3>
          <div>
            <div className="mb-2"><span>Product: {product?.name}</span></div>
            <div className="mb-2"><span>User: {user?.name}</span></div>
            <div className="mb-2">
              <label>Quantity:</label>
              <input type="number" min="1" max="99" value={quantity} onChange={e => setQuantity(e.target.value)} className="border p-2 rounded ml-2 w-20" />
            </div>
            <div className="mb-2">
              <label>Store:</label>
              <select value={store} onChange={e => setStore(e.target.value)} className="border p-2 rounded ml-2">
                <option value="">Select</option>
                <option value="Main Branch">Main Branch</option>
                <option value="Retail Outlet">Retail Outlet</option>
              </select>
            </div>
          </div>
          <button onClick={handleOrder} disabled={loading} className="bg-green-600 text-white rounded px-4 py-2 mt-4 w-full">
            {loading ? "Processing..." : "Place Order"}
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OrderModal;

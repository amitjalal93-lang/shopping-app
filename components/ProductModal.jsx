"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  product = null,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
      });
    } else {
      setFormData({
        title: "",
        price: "",
        category: "",
        description: "",
        image: "",
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, product?._id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select> */}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Image URL
            </label>
            <input
              type="file"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 outline-none"
            >
              {product ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-400 outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

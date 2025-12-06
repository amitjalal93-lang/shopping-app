"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CategoryModal = ({ isOpen, onClose, onSave, category = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, category?._id);
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
          {category ? "Edit Category" : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            />
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
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 outline-none"
            >
              {category ? "Update" : "Add"}
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

export default CategoryModal;

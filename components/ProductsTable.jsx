"use client";
import Button from "@/app/components/Button";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import React from "react";

const ProductsTable = ({
  products,
  loading,
  onAddToCart,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <p className="text-center text-gray-400">Loading products...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200 border-b-2 border-gray-300">
            <th className="p-3 text-left text-sm font-semibold">Image</th>
            <th className="p-3 text-left text-sm font-semibold">Title</th>
            <th className="p-3 text-left text-sm font-semibold">Category</th>
            <th className="p-3 text-left text-sm font-semibold">Price</th>
            <th className="p-3 text-left text-sm font-semibold">Rating</th>
            <th className="p-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <motion.tr
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-b border-gray-300 hover:bg-gray-50"
            >
              <td className="p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-contain"
                />
              </td>
              <td className="p-3">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {product.name}
                </p>
              </td>
              <td className="p-3">
                <p className="text-xs text-gray-500">
                  {product?.category?.name}
                </p>
              </td>
              <td className="p-3">
                <p className="text-orange-500 font-bold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(product.price)}
                </p>
              </td>
              <td className="p-3">
                <span className="text-yellow-500 text-sm">
                  ★ {product.rating || "N/A"}
                </span>
                <span className="text-gray-500 text-xs ml-1">
                  ({product.userratingcount || 0})
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;

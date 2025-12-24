"use client";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const CategoriesTable = ({ categories, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p className="text-center text-gray-400">Loading categories...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200 border-b-2 border-gray-300">
            <th className="p-3 text-left text-sm font-semibold">Image</th>
            <th className="p-3 text-left text-sm font-semibold">Name</th>
            <th className="p-3 text-left text-sm font-semibold">Description</th>
            <th className="p-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <motion.tr
              key={category._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-b border-gray-300 hover:bg-gray-50"
            >
              <td className="p-3">
                <Image
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 object-contain"
                  width={64}
                  height={64}
                />
              </td>
              <td className="p-3">
                <p className="text-sm font-semibold text-gray-800">
                  {category.name}
                </p>
              </td>
              <td className="p-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(category._id)}
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

export default CategoriesTable;

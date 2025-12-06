"use client";
import CategoriesTable from "@/components/CategoriesTable";
import CategoryModal from "@/components/CategoryModal";
import {
  apiDeleteRequestAuthenticated,
  apiGetRequest,
  apiPostRequestAuthenticated,
  apiPutRequestAuthenticated,
} from "@/utils/api";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    // Initialize with default categories

    const getCategories = async () => {
      const response = await apiGetRequest("/categories");
      const { total, categories } = response?.data || {};
      setCategories(categories || []);
    };

    getCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (formData, categoryId) => {
    console.log("c", categoryId);
    if (categoryId) {
      const response = await apiPutRequestAuthenticated(
        `/categories/${categoryId}`,
        formData
      );

      const { category } = response?.data || {};

      // Edit existing category
      setCategories((prev) =>
        prev.map((c) => (c._id === categoryId ? { ...category } : c))
      );
    } else {
      // Add new category
      const newCategory = {
        ...formData,
      };
      const response = await apiPostRequestAuthenticated(
        "/categories",
        newCategory
      );

      const { category } = response?.data || {};

      setCategories((prev) => [category, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      categoryId &&
      confirm("Are you sure you want to delete this category?")
    ) {
      const response = await apiDeleteRequestAuthenticated(
        `/categories/${categoryId}`
      );
      setCategories((prev) => prev.filter((c) => c._id !== categoryId));
    }
  };

  return (
    <div className="p-4 flex flex-col items-end h-full">
      <div className="flex gap-4 mb-4 w-full justify-end">
        <input
          type="text"
          placeholder="Search categories..."
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={() => handleOpenModal()}
          className="border rounded bg-red-500 px-4 py-2 text-white flex items-center gap-2 outline-none hover:bg-red-600"
        >
          <Plus />
          Add Category
        </button>
      </div>
      <div className="w-full">
        <CategoriesTable
          categories={categories}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDeleteCategory}
        />
      </div>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default Page;

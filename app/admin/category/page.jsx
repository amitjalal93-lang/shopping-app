"use client";
import CategoriesTable from "@/components/CategoriesTable";
import CategoryModal from "@/components/CategoryModal";
import {
  apiDeleteRequestAuthenticated,
  apiFilePostRequestAuthenticated,
  apiGetRequest,
  apiFilePutRequestAuthenticated,
  BASE_URL,
} from "@/utils/api";
import { getAccessTokenLocalStorage } from "@/utils/localstorage";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState("");

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
    if (categoryId) {
      try {
        const response = await apiFilePutRequestAuthenticated(
          `/categories/${categoryId}`,
          formData
        );

        const { category } = response?.data || {};

        // Edit existing category
        setCategories((prev) =>
          prev.map((c) => (c._id === categoryId ? { ...category } : c))
        );
      } catch (err) {
        console.log("hello", err);
      }
    } else {
      const response = await apiFilePostRequestAuthenticated(
        "/categories",
        formData
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
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col items-end h-full ">
      <div className="sm:flex gap-4 mb-4 w-full justify-end   ">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2  rounded my-3 sm:my-0  "
        />

        <button
          onClick={() => handleOpenModal()}
          className="border rounded bg-red-500 px-4 sm:py-2   py-1.5  text-white flex items-center gap-2 outline-none hover:bg-red-600"
        >
          <Plus />
          Add Category
        </button>
      </div>
      <div className="w-full">
        <CategoriesTable
          categories={filteredCategories}
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

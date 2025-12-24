"use client";
import ProductsTable from "./ProductsTable";
import ProductModal from "./ProductModal";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  apiDeleteRequestAuthenticated,
  apiFilePostRequestAuthenticated,
  apiFilePutRequestAuthenticated,
  apiGetRequest,
} from "@/utils/api";
import Pagination from "./Pagination";
import { useCategoryStore } from "@/store/categoryStore";

const Adminproducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const { categoryId, setCategoryId } = useCategoryStore();
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = categoryId
          ? `/products?page=${page}&limit=10&category=${categoryId}`
          : `/products?page=${page}&limit=10`;

        const res = await apiGetRequest(url);
        const { pagination, products } = res?.data || {};

        setProducts(
          products
            ? products.map((product) => ({
                ...product,
                title: product.name,
              }))
            : []
        );

        setPagination(pagination);
      } catch (err) {
        console.log("API error:", err);
      }
      setLoading(false);
    };

    load();
  }, [page, categoryId]); // 👈 categoryId add

  useEffect(() => {
    const getCategories = async () => {
      const res = await apiGetRequest("/categories");
      const { total, categories } = res?.data || {};
      setCategories(categories || []);
    };

    getCategories();
  }, []);

  const handleAdd = (product) => {
    console.log("Add to cart:", product);
    // Add your cart logic here
  };

  const handleView = (productId) => {
    console.log("View product:", productId);
    // Add your navigation logic here
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (formData, productId) => {
    if (productId) {
      // Edit existing product
      const response = await apiFilePutRequestAuthenticated(
        `/products/${productId}`,
        formData
      );

      const product = response?.data || {};

      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...product, ...formData } : p))
      );
      console.log("Product updated:", productId);
    } else {
      // Add new product

      const response = await apiFilePostRequestAuthenticated(
        "/products",
        formData
      );
      const { message, product } = response?.data || {};
      setProducts((prev) => [product, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = async (productId) => {
    if (productId && confirm("Are you sure you want to delete this product?")) {
      const response = await apiDeleteRequestAuthenticated(
        `/products/${productId}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      console.log("Product deleted:", productId);
    }
  };

  return (
    <div className="p-4 flex flex-col items-end h-full">
      <div className="sm:flex gap-4 mb-2 ">
        <div className="flex items-center gap-2 mb-4">
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1); // category change pe page reset
            }}
            className="bg-cyan-300 rounded px-3 py-2 border-2 border-black outline-none"
          >
            <option value="">All</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            className="border rounded bg-red-500 px-3 py-1.5 text-white flex items-center gap-2 outline-none hover:bg-red-600"
          >
            <Plus />
            Add Product
          </button>
        </div>
        <div className="flex items-center mb-2 ">
          <input
            type="text"
            placeholder="Search Produts..."
            className="border px-3 py-1 rounded"
          />
          <button className="border rounded bg-green-400 px-3 py-1 text-white outline-none">
            Search
          </button>
        </div>
      </div>
      <div className="w-full">
        <ProductsTable
          products={products}
          loading={loading}
          onAddToCart={handleAdd}
          onView={handleView}
          onEdit={handleOpenModal}
          onDelete={handleDeleteProduct}
        />
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />
      {pagination && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          onPageChange={setPage}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default Adminproducts;

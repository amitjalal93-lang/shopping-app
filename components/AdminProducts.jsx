"use client";
import Button from "@/app/components/Button";
import ProductsTable from "./ProductsTable";
import ProductModal from "./ProductModal";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  apiDeleteRequestAuthenticated,
  apiGetRequest,
  apiPostRequestAuthenticated,
  apiPutRequestAuthenticated,
} from "@/utils/api";

const Adminproducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiGetRequest("/products");
        const { pagination, products } = res?.data || {};
        console.log("Products fetched:", products);
        setProducts(
          products
            ? products?.map((product) => ({ ...product, title: product.name }))
            : []
        );
      } catch (err) {
        console.log("API error:", err);
      }
      setLoading(false);
    };

    load();
  }, []);

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
      const response = await apiPutRequestAuthenticated(
        `/products/${productId}`,
        {
          ...formData,
          name: formData.title,
          category: formData.category._id,
        }
      );

      const product = response?.data || {};

      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...product, ...formData } : p))
      );
      console.log("Product updated:", productId);
    } else {
      // Add new product

      const newProduct = {
        ...formData,
        name: formData.title,
      };
      console.log("formData", newProduct);

      const response = await apiPostRequestAuthenticated(
        "/products",
        newProduct
      );
      const { message, product } = response?.data || {};
      setProducts((prev) => [product, ...prev]);
      console.log("New product added:", newProduct);
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
      <div className="flex gap-4 mb-2">
        <select className="bg-cyan-300 rounded px-3 py-2 border-2 border-black outline-none">
          <option disabled selected>
            Category
          </option>
          <option>All</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
        </select>
        <div className="flex items-center ">
          <input
            type="text"
            placeholder="Search Produts..."
            className="border px-3 py-1 rounded"
          />
          <button className="border rounded bg-green-400 px-3 py-1 text-white outline-none">
            Search
          </button>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="border rounded bg-red-500 px-3 py-1.5 text-white flex items-center gap-2 outline-none hover:bg-red-600"
        >
          <Plus />
          Add Products
        </button>
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
    </div>
  );
};

export default Adminproducts;

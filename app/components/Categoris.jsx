"use client";

import { useCategoryStore } from "@/store/categoryStore";
import { apiGetRequest } from "@/utils/api";
import React, { useEffect, useState } from "react";

const Categoris = () => {
  const [categories, setCategories] = useState([]);

  const { categoryId, setCategoryId } = useCategoryStore();

  useEffect(() => {
    const getCategories = async () => {
      const res = await apiGetRequest("/categories");
      const { total, categories } = res?.data || {};
      setCategories(categories || []);
    };

    getCategories();
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-3 py-2 border-b border-black bg-[#313131] scrollbar-hide sm:justify-center">
        <button
          onClick={() => setCategoryId("")}
          className={`px-4 py-1.5 rounded-md text-white text-sm font-medium hover:bg-[#4a4a4a] 
          ${categoryId === "" ? "bg-[#4a4a4a]" : ""}
          `}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setCategoryId(category._id)}
            className={`px-4 py-1.5 rounded-md text-white text-sm font-medium hover:bg-[#4a4a4a]
        ${categoryId === category._id ? "bg-[#4a4a4a]" : ""}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categoris;

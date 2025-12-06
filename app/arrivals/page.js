"use client";
import { apiGetRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await apiGetRequest("/products");
      const { products, pagination } = res?.data || {};
      setProducts(products || []);
    };
    fetchProducts();
  }, []);
  const router = useRouter();
  return (
    <div className="p-6 ">
      {/* back button */}
      <button
        onClick={() => router.back()}
        className="px-4 py-2 mb-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-6">New Arrivals</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="border p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <img src={p.image} className="h-36 mx-auto object-contain" />
            <h2 className="font-semibold mt-2 line-clamp-2">{p.name}</h2>
            <p className="text-orange-600 font-bold mt-1">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

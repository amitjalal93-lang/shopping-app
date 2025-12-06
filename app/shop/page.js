"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
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
      <h1 className="text-3xl font-bold mb-6">Shop All Products</h1>

      <div className="grid grid-cols md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <img src={p.image} className="h-36 mx-auto object-contain" />
            <h2 className="font-semibold mt-2 line-clamp-2">{p.title}</h2>
            <p className="text-orange-600 font-bold mt-1">₹{p.price * 85}</p>
            <button
              className="mt-4 bg-green-500 px-6 py-2 text-white rounded hover:bg-green-600 "
              onClick={() => {
                router.push("/");
              }}
            >
              Shop
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

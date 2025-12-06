"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/slices/cartSlices.js";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };
    load();
  }, [id]);
  const router = useRouter();

  if (!product)
    return <p className="p-5 text-center text-gray-400">Loading product...</p>;

  const benefits = [
    "High durability with premium build quality",
    "Designed for everyday practical usage",
    "Gives excellent performance for long time",
    "Comfortable and lightweight for daily use",
    "Tested and approved by thousands of customers",
  ];

  const features = [
    "Top-tier material quality",
    "Special ergonomic design",
    "Smooth handling & performance",
    "Scratch and damage resistant",
    "Latest updated version model",
  ];
  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto">
      {/* Back Button */}

      <div className="w-fit mb-5">
        <Button
          text="← Back"
          type="secondary"
          onClick={() => router.back()}
          checkLogin={false}
        />
      </div>
      <div className="md:flex gap-10">
        {/* Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src={product.image}
            className="w-72 h-72 object-contain border p-4 rounded-xl shadow"
          />
        </div>

        {/* Info */}
        <div className="md:w-1/2 w-full mt-6 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {product.title}
          </h1>

          <p className="text-gray-500 text-sm mt-2">{product.category}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-yellow-500 font-bold">
              ★ {product.rating.rate}
            </span>
            <span className="text-gray-500 text-sm">
              ({product.rating.count} reviews)
            </span>
          </div>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <p className="text-orange-600 mt-5 text-3xl font-bold">
            ₹{(product.price * 84).toFixed(0)}
          </p>

          {/* Add to Cart */}
          <div className="w-fit mt-3">
            <Button
              text="Add to Cart"
              onClick={() => {
                dispatch(addToCart({ ...product, qty: 1 }));
                toast.success("Item added to cart");
              }}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Key Features</h2>
        <ul className="list-disc ml-6 text-gray-700 leading-7">
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Product Benefits</h2>
        <ul className="list-disc ml-6 text-gray-700 leading-7">
          {benefits.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      {/* Usage */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">How This Product Helps You?</h2>
        <p className="text-gray-700 leading-relaxed">
          This product is designed to make your daily life easier, more
          comfortable, and more efficient. Whether you&apos;re using it for
          work, travel, entertainment, or home use, it provides exceptional
          value and long-lasting performance. Its high build quality ensures
          reliability and makes it a great choice for anyone looking for a
          premium experience at an affordable price.
        </p>
      </div>
    </div>
  );
}

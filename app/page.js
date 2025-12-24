"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/app/components/Button.jsx";
import { apiGetRequest, apiPostRequestAuthenticated } from "@/utils/api.js";
import Pagination from "@/components/Pagination";
import { useCategoryStore } from "@/store/categoryStore";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const data = [
  {
    id: 1,
    title1: "Next-Level Gaming Starts",
    title2: "Here Discover PlayStation",
    title3: "5 Today!",
    img: "/ps.png",
    bgcolor: "bg-pink-200",
    button: "Shop Now",
    description: "High-quality matirial use for PS5.",
    price: 899,
    basePrice: 899,
  },
  {
    id: 2,
    title1: "Power Meets Elegance",
    title2: "Apple MacBook Pro Is Here",
    title3: "For You!",
    img: "/mac.png",
    bgcolor: "bg-cyan-200",
    button: "Buy Now",
    description: "Sleek and powerful laptop for all needs.",
    price: 1299,
    basePrice: 1299,
  },
  {
    id: 3,
    title1: "Experience Pure Sound",
    title2: "Your Perfect Headphones",
    title3: "Awaits!",
    img: "/headphone.png",
    bgcolor: "bg-yellow-200",
    button: "Order Now",
    description: "Immersive audio experience with noise cancellation.",
    price: 1799,
    basePrice: 1799,
  },
];

export default function Page() {
  //
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const { categoryId } = useCategoryStore();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  const handleAdd = async (item) => {
    if (user) {
      await addToCart(item._id, 1);
      toast.success("Item added to cart");
    } else {
      toast.error("Please login to add items to cart");
    }
  };

  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  //finger scroll bar
  useEffect(() => {
    const el = scrollRef.current;

    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // fake api call for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiGetRequest(
          `/products?page=${page}&limit=15&category=${categoryId}`
        );
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
  }, [page, categoryId]);

  return (
    <div className="px-4 md:px-6">
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll snap-x snap-mandatory w-full scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none; 
          }
        `}</style>

        {data.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="snap-start min-w-full flex items-center justify-center  px-4 md:px-6"
          >
            <div
              className={`w-full max-w-[1100px] ${item.bgcolor} p-6 md:p-12 rounded-2xl shadow flex flex-col md:flex-row gap-4 md:gap-6 items-center`}
            >
              {/* tittle */}
              <div className="flex-1">
                <p className="text-orange-500 text-base md:text-lg font-medium mb-2">
                  Hurry up only few lefts!
                </p>

                <h1 className="text-[18px] md:text-4xl font-extrabold text-gray-700 leading-tight">
                  {item.title1}
                  <span className="block">{item.title2}</span>
                  <span className="block">{item.title3}</span>
                </h1>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  {/* shop button  */}

                  <Button
                    className="w-fit! px-4 py-2 md:px-6 md:py-3 bg-orange-500 text-white rounded-lg shadow"
                    text={item.button}
                    onClick={() => {
                      router.push("/");
                    }}
                  />
                </div>
              </div>

              {/* images */}
              <div className="flex-1 flex justify-center">
                <img
                  src={item.img}
                  className="max-w-[300px] md:max-w-[420px] max-h-[150px] md:max-h-[300px] object-contain"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* dots */}
      <div className="flex justify-center my-4 gap-5">
        {data.map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              activeIndex === i ? "bg-orange-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* products list*/}
      <h1 className="text-xl md:text-3xl font-bold my-4">Popular Products</h1>
      {/* api call loading products  */}
      {loading ? (
        <p className="text-center text-gray-400">Loading products...</p>
      ) : (
        <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {products?.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-300  rounded-xl p-3 shadow hover:shadow-lg cursor-pointer"
              onClick={() => router.push(`/products/${p._id}`)}
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-32 object-contain mb-3"
              />

              <h2 className="text-sm font-semibold line-clamp-2 text-gray-800">
                {p.title}
              </h2>

              {/* items category */}
              <p className="text-xs text-gray-500 mt-1">{p.category?.name}</p>

              {/* items description */}
              <p className="text-[12px] text-gray-600 line-clamp-2 mt-1">
                {p.description}
              </p>

              {/* items rating */}
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500 text-sm">★ {p.rating}</span>
                <span className="text-gray-500 text-xs">
                  ({p.userratingcount})
                </span>
              </div>

              {/* items price */}
              <p className="text-orange-500 font-bold mt-2">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(p.price)}
              </p>

              {/* buy buttons  */}
              <div className="grid grid-cols-12 gap-2 mt-3 justify-between">
                <div className="col-span-7">
                  <Button text="Add to Cart" onClick={() => handleAdd(p)} />
                </div>

                <div className="col-span-5">
                  <Button
                    text="View →"
                    type="secondary"
                    onClick={() => router.push(`/cart`)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* next page prev page */}
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
}

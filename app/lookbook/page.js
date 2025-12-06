"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function LookbookPage() {
  const looks = [
    {
      id: 1,
      title: "Urban Street Look",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      desc: "Stay ahead with the newest minimalist street style.",
    },
    {
      id: 2,
      title: "Summer Casual Fit",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      desc: "Light, breathable & comfortable summer outfit.",
    },
    {
      id: 3,
      title: "Classic Winter Style",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      desc: "Warm and premium winter layering essentials.",
    },
  ];
  const router = useRouter();
  return (
    <div className=" p-6 md:p-12">
      {/* back button */}
      <button
        onClick={() => router.back()}
        className="px-4 py-2 mb-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
      >
        ← Back
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center">
        Lookbook – Style Inspiration
      </h1>

      {/* Grid Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {looks.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl overflow-hidden shadow hover:shadow-xl transition"
          >
            <img
              src={item.image}
              className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
            />

            <div className="p-4">
              <h2 className="font-bold text-xl">{item.title}</h2>
              <p className="text-gray-500 mt-1">{item.desc}</p>

              <button className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Shop This Look
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="mt-16 rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

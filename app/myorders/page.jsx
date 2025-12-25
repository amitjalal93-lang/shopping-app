"use client";

import { apiGetRequestAuthenticated } from "@/utils/api";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiGetRequestAuthenticated("/orders");
        const data = res?.data || [];
        setOrders(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Order fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ---------- HELPERS ---------- */

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const groupItemsByProduct = (items = []) => {
    const map = {};
    items.forEach((it) => {
      const id = it.product?._id;
      if (!id) return;

      if (!map[id]) {
        map[id] = { ...it, qty: it.qty || 1 };
      } else {
        map[id].qty += it.qty || 1;
      }
    });
    return Object.values(map);
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex items-center pb-4 ">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="px-3 py-1 rounded  border mb-5 hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-3xl mx-auto font-bold mb-6 text-gray-800">
          My Orders
        </h1>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No orders found</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const groupedItems = groupItemsByProduct(order.items);

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md border border-gray-200"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-wrap justify-between gap-4 p-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm">{order._id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-semibold text-lg text-gray-900">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="divide-y">
                  {groupedItems.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex gap-4 p-4 items-center"
                    >
                      {/* IMAGE */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />

                      {/* DETAILS */}
                      <div className="flex-1">
                        <h2 className="font-semibold text-gray-800">
                          {item.product.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Category: {item.product.category?.name || "—"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity:{" "}
                          <span className="font-medium">{item.qty}</span>
                        </p>
                      </div>

                      {/* PRICE */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.product.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* STATUS */}
                <div className="p-4 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
                  <span>
                    Payment Status:{" "}
                    <span className="font-medium capitalize">
                      {order.paymentStatus}
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {groupedItems.length} product(s)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;

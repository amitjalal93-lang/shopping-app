"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";
import { apiPostRequestAuthenticated } from "@/utils/api";
import { toast } from "react-toastify";

export default function CartPage() {
  const router = useRouter();

  const { clearCart, cart, removeFromCart, updateCartQuantity, totalAmount } =
    useCartStore();

  // PRICE CALCULATION
  const discount = 0;

  // ✔ CORRECT SIZE PRICE LOGIC (NO MULTIPLIER)

  const handleClearCart = async () => {
    clearCart();
  };

  const handleCart = async (productId, qty) => {
    updateCartQuantity(productId, qty);
  };

  return (
    <div className="p-4 md:p-10 pt-20">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="px-3 py-1 rounded border mb-5 hover:bg-gray-100"
      >
        ← Back
      </button>

      {/* CLEAR CART BUTTON */}
      {cart.length > 0 && (
        <button
          onClick={handleClearCart}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
      )}
      {/*  continue  shopping button*/}
      <button
        onClick={() => router.push("/")}
        className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Continue Shopping
      </button>
      <div className="grid md:grid-cols-3 gap-6 mt-4">
        {/* LEFT SIDE – CART ITEMS */}
        <div className="md:col-span-2">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-xl p-4 mb-4 shadow flex gap-4"
            >
              <img
                src={item.product.image}
                className="w-28 h-28 object-contain"
              />

              <div className="flex-1">
                <h2 className="font-bold text-lg ">{item.product.name}</h2>

                {/* ✔ FIXED PRICE DISPLAY */}
                <p className="font-semibold text-orange-600 mt-2">
                  ₹{item.product.price.toFixed(0)}
                </p>
                {/* rating */}
                <p className="text-yellow-500 text-sm">
                  ⭐ {item.product?.rating ?? 4.5} / 5
                </p>

                {/* Quantity Buttons */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      item.qty > 1 && handleCart(item.product._id, item.qty - 1)
                    }
                    className="px-3 py-1 border rounded"
                  >
                    –
                  </button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => handleCart(item.product._id, item.qty + 1)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-500 text-sm mt-3 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="bg-white p-5 rounded-xl shadow h-fit sticky top-24">
              <p className="text-gray-500 text-lg mt-10">
                Your cart is empty 😔
              </p>
              <p>Please add some items to your cart 😔.</p>
              <p>You can go to the Shop Page to add items to your cart.</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE – PRICE DETAILS */}
        <div className="bg-white p-5 rounded-xl shadow h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-3">Price Details</h2>

          <div className="flex justify-between mb-2">
            <p>Price ({cart.length} items)</p>
            <p>₹{totalAmount.toFixed(0)}</p>
          </div>

          <div className="flex justify-between mb-2">
            <p>Discount</p>
            <p className="text-green-600">− {discount.toFixed(0)}</p>
          </div>

          <div className="flex justify-between mb-2">
            <p>Delivery Charges</p>
            <p className="text-green-600">FREE</p>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <p>Total Amount</p>
            <p>₹{(totalAmount - discount).toFixed(0)}</p>
          </div>
          {/* payment button */}
          <button
            onClick={async () => {
              try {
                if (cart.length === 0) {
                  toast.error("Please add some items to your cart.");
                  return;
                }
                // create order on backend (server will use user's cart)
                const items = cart.map((item) => ({
                  product: item.product._id,
                  qty: item.qty,
                  price: item.product.price,
                }));
                const payload = { items, amount: totalAmount };
                const res = await apiPostRequestAuthenticated(
                  "/orders/create",
                  payload
                );
                const order = res?.data?.order || res?.data;
                const orderId = order?._id || order?.id || order?.orderId;
                if (!orderId) {
                  alert("Could not create order. Try again.");
                  return;
                }
                // navigate to checkout with orderId
                router.push(`/checkout?orderId=${orderId}`);
              } catch (error) {
                console.error(error);
                alert("Error creating order. Check console.");
              }
            }}
            className="w-full bg-orange-600 hover:bg-orange-700 py-2 mt-4 rounded-lg font-semibold text-white"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

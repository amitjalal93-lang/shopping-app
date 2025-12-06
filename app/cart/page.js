"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import PaymentButton from "../payment/page";
import {
  apiDeleteRequestAuthenticated,
  apiGetRequestAuthenticated,
  apiPutRequestAuthenticated,
} from "@/utils/api";
import { useUserStore } from "@/store/user";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = React.useState([]);
  const [totalMoney, setTotalMoney] = React.useState(0);
  const { setCartCounter } = useUserStore();

  useEffect(() => {
    const getCart = async () => {
      const cartItems = await apiGetRequestAuthenticated("/cart");
      const { cart, total } = cartItems?.data || {};
      setTotalMoney(total || 0);

      setItems(cart || []);
    };

    getCart();
  }, []);

  // const items = useSelector((state) => state.cart.items);

  // PRICE CALCULATION
  const discount = 0;

  // ✔ CORRECT SIZE PRICE LOGIC (NO MULTIPLIER)
  const getSizePrice = (basePrice, size) => {
    if (size === "S") return basePrice - 50; // 1200 → 1150
    if (size === "M") return basePrice; // 1200
    if (size === "L") return basePrice + 30; // 1200 → 1230
    if (size === "XL") return basePrice + 50; // 1200 → 1250
    return basePrice;
  };

  const handleClearCart = async () => {
    const response = await apiDeleteRequestAuthenticated("/cart/clear");
    const { cart } = response?.data || {};
    setItems(cart || []);
    setCartCounter(0);
  };

  const handleCart = async (productId, qty) => {
    const response = await apiPutRequestAuthenticated("/cart/update", {
      productId: productId,
      qty,
    });
    const { total, cart } = response?.data || {};
    setItems(cart || []);
    setCartCounter(cart.length);
    setTotalMoney(total);
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
      {items.length > 0 && (
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
          {items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-xl p-4 mb-4 shadow flex gap-4"
            >
              <img
                src={item.product.image}
                className="w-28 h-28 object-contain"
              />

              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.product.name}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                {/* SIZE SELECTOR */}
                {item.category === "men's clothing" ||
                item.category === "women's clothing" ||
                item.category === "clothing" ||
                item.category === "fashion" ? (
                  <div className="mt-3">
                    <p className="font-semibold mb-1">Select Size:</p>

                    <select
                      value={item.size}
                      onChange={(e) =>
                        dispatch(
                          updateSize({
                            id: item.id,
                            newSize: e.target.value,
                            newPrice: getSizePrice(
                              item.basePrice,
                              e.target.value
                            ),
                          })
                        )
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                ) : null}

                {/* ✔ FIXED PRICE DISPLAY */}
                <p className="font-semibold text-orange-600 mt-2">
                  ₹{item.product.price.toFixed(0)}
                </p>

                <p className="text-yellow-500 text-sm">
                  ⭐ {item.product?.rating ?? 4.5} / 5
                </p>

                {/* Quantity Buttons */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleCart(item.product._id, item.qty - 1)}
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
                  onClick={() => {}}
                  className="text-red-500 text-sm mt-3 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
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
            <p>Price ({items.length} items)</p>
            <p>₹{totalMoney.toFixed(0)}</p>
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
            <p>₹{(totalMoney - discount).toFixed(0)}</p>
          </div>

          {/* <button className="w-full bg-orange-600 hover:bg-orange-700 py-2 mt-4 rounded-lg font-semibold text-white">
            Proceed to Payment
          </button> */}
          {/* payment button */}
          <PaymentButton
            cartItems={[
              { name: "T-shirt", price: 999, qty: 1, image: "/img1.png" },
              { name: "Shoes", price: 1999, qty: 1, image: "/img2.png" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

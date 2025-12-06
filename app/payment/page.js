"use client";
import React from "react";

const PaymentButton = ({ cartItems }) => {
  const handlePayment = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // redirect to stripe
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-orange-600 hover:bg-orange-700 py-2 mt-4 rounded-lg font-semibold text-white"
    >
      Proceed to Payment
    </button>
  );
};

export default PaymentButton;

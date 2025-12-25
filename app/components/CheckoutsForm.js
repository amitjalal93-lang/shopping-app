"use client"; // if using app router; otherwise normal component
import {
  apiGetRequestAuthenticated,
  apiPostRequestAuthenticated,
} from "@/utils/api";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";

export default function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const resp = await apiPostRequestAuthenticated(`/payment/process`, {
      orderId,
    });

    const { clientSecret } = resp.data;

    // 2) confirm on client
    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      // 3) optional: call verify or rely on webhook
      //   await axios.get(
      //     ${process.env.NEXT_PUBLIC_BACKEND_URL || ""}/api/payment/verify/${result.paymentIntent.id},
      //     { headers: { Authorization: Bearer ${localStorage.getItem("token")} } }
      //   );

      //   await apiGetRequestAuthenticated(`/payment/verify`)

      // show success, redirect, refresh order state
      alert("Payment successful");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePay}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        Pay
      </button>
    </form>
  );
}

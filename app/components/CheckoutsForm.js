"use client"; // if using app router; otherwise normal component
import { useCartStore } from "@/store/cartStore";
import {
  apiGetRequestAuthenticated,
  apiPostRequestAuthenticated,
} from "@/utils/api";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("IN");
  const { clearCart } = useCartStore();

  const cardOptions = {
    // hide postal code from CardElement UI — we'll send a default postal code when confirming
    hidePostalCode: true,
    style: {
      base: {
        color: "#111827",
        fontSize: "16px",
        fontFamily:
          'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        "::placeholder": { color: "#9CA3AF" },
      },
      invalid: { color: "#ef4444" },
    },
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!orderId) {
      alert("Missing orderId");
      return;
    }

    setLoading(true);
    try {
      const customer = {
        name: customerName || "Customer",
        address: {
          line1: addressLine1 || "N/A",
          city: city || "N/A",
          state: stateVal || "N/A",
          postal_code: postalCode || "000000",
          country: country || "IN",
        },
      };

      const resp = await apiPostRequestAuthenticated(`/payment/process`, {
        orderId,
        customer,
      });

      const { clientSecret, paymentIntentId: piId } = resp?.data || {};
      if (piId) setPaymentIntentId(piId);

      if (!clientSecret) {
        alert("No client secret returned from server.");
        setLoading(false);
        return;
      }

      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: customer.name,
            address: {
              line1: customer.address.line1,
              city: customer.address.city,
              state: customer.address.state,
              postal_code: customer.address.postal_code,
              country: customer.address.country,
            },
          },
        },
      });

      console.log("erro", result);

      if (result.error) {
        alert(result.error.message || "Payment failed");
        setLoading(false);
        return;
      }

      const pi = result.paymentIntent;
      if (pi?.status === "succeeded") {
        setSuccess(true);
        setPaymentIntentId(pi.id);
        // Verify with backend (optional) — will also be updated by webhook
        try {
          clearCart();
          await apiGetRequestAuthenticated(`/payment/verify/${pi.id}`);
        } catch (err) {
          // ignore verification errors here; webhook may update order
          console.warn("Verify call failed", err);
        }
        alert("Payment successful");
      } else {
        alert("Payment did not succeed. Status: " + (pi?.status || "unknown"));
      }
    } catch (error) {
      console.error(error);
      alert("Payment error. Check console.");
    }
    setLoading(false);
  };
  const router = useRouter();
  const handleRefund = async () => {
    if (!orderId) return alert("Missing orderId for refund");
    if (!refundAmount) return alert("Enter refund amount");
    try {
      const amt = Number(refundAmount);
      if (Number.isNaN(amt) || amt <= 0) return alert("Enter valid amount");
      await apiPostRequestAuthenticated(`/payment/${orderId}/refund`, {
        amount: amt,
      });
      alert("Refund requested (check backend/stripe)");
      setRefundAmount("");
    } catch (error) {
      console.error(error);
      alert("Refund failed. Check console.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center mb-6">
        {/* back button */}
        <button
          onClick={() => router.back()}
          className="px-4 py-2  bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
        >
          ← Back
        </button>
        <h3 className="text-2xl  mx-auto  font-bold ">Checkout</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Order: {orderId || "—"}</p>

      {!success ? (
        <form onSubmit={handlePay} className="space-y-4">
          <div className="border rounded p-3">
            <CardElement options={cardOptions} />
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
          >
            {loading ? "Processing…" : "Pay Now"}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-green-600 font-medium">Payment succeeded ✅</p>
          <p className="text-sm text-gray-600">
            PaymentIntent: {paymentIntentId}
          </p>

          <div className="pt-3 border-t">
            <p className="font-semibold">Test Refund</p>
            <div className="flex gap-2 mt-2">
              <input
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Amount (e.g. 100)"
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                onClick={handleRefund}
                className="bg-red-500 text-white px-3 rounded"
              >
                Refund
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Partial or full refunds supported by backend.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

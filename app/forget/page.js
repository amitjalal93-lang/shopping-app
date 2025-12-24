"use client";

import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const { user, isAdmin, isCheckingAuth } = useAuthStore();

  // Already logged in check
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user, router, isAdmin]);

  const onSubmit = (data) => {
    console.log("Forgot Password Request:", data);
    alert("If this email exists, a reset link will be sent!");
    // ⚙️ Yahan backend API call lagti hai e.g.
    // fetch("/api/forgot-password", { method: "POST", body: JSON.stringify(data) })
  };

  if (isCheckingAuth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Enter your Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                message: "Invalid email format",
              },
            })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition"
        >
          Send Reset Link
        </button>

        <Link
          href="/register"
          className="flex justify-center mt-4 hover:underline hover:text-blue-400"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}

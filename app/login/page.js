"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const { user, login, isCheckingAuth, isAdmin } = useAuthStore();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);

    if (result.success) {
      if (result.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  };

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user, router, isAdmin]);

  if (isCheckingAuth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center  text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email Address</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {" "}
              {errors.password.message}{" "}
            </p>
          )}
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition"
        >
          Login Now
        </button>
        <p className="text-center mt-4">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            Register Now
          </Link>
        </p>
      </form>
    </div>
  );
}

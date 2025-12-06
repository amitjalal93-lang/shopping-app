"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/app/firebase";

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Already logged in check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const googleUser = JSON.parse(localStorage.getItem("googleUser"));

    if (user?.loggedIn || googleUser?.loggedIn) {
      router.push("/"); // Already logged in → Go to home
    }
  }, []);

  // NORMAL FORM SUBMIT
  const onSubmit = (data) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: data.name,
        email: data.email,
        number: data.number,
        gender: data.gender,
        photo: null, // Normal user has no photo
        loggedIn: true,
      })
    );

    router.push("/");
  };

  // GOOGLE LOGIN — name, email, photo save
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const name = result.user.displayName;
      const email = result.user.email;
      const photo = result.user.photoURL;

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: name,
          email: email,
          photo: photo,
          number: null,
          gender: null,
          loggedIn: true,
        })
      );

      router.push("/");
    } catch (err) {
      console.log("Google Login Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-2xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

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
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            className="w-full p-2 pr-10 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-blue-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Number */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="number"
            placeholder="Enter your number..."
            {...register("number", {
              required: "Number is required",
              minLength: { value: 10, message: "Must be 10 digits" },
            })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.number && (
            <p className="text-red-400 text-sm mt-1">{errors.number.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Gender</label>
          <select
            {...register("gender", { required: "Please select gender" })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            {...register("terms", { required: "Please accept terms" })}
            className="w-4 h-4"
          />
          <label>I agree to the terms and conditions</label>
        </div>
        {errors.terms && (
          <p className="text-red-400 text-sm mb-3">{errors.terms.message}</p>
        )}

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
        >
          Login with Google
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition"
        >
          Submit
        </button>

        <Link
          href="/login"
          className="flex justify-center mt-4 hover:underline hover:text-red-400"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

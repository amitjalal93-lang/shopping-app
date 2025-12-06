"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { isUserLoggedIn } from "@/utils/auth";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const EcommerceHeader = () => {
  const [open, setOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const isUserLogin = isUserLoggedIn();

  const items = useSelector((state) => state.cart.items);

  // Load user from localStorage
  useEffect(() => {
    const normalUser = JSON.parse(localStorage.getItem("user"));
    const googleUser = JSON.parse(localStorage.getItem("googleUser"));

    if (googleUser?.loggedIn) setUser(googleUser);
    else if (normalUser?.loggedIn) setUser(normalUser);
  }, []);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("googleUser");
    setUser(null);
    router.push("/register");
  };

  return (
    <>
      {/* Main Header */}
      <div className="fixed top-0 left-0 right-0 h-16 p-4 shadow flex justify-between items-center bg-blue-400 z-40">
        <h1 className="text-2xl font-bold text-white">Shopping App</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-white font-medium">
          <button
            className="hover:text-orange-400 hover:underline"
            onClick={() => router.push("/shop")}
          >
            Shop
          </button>
          <button
            className="hover:text-orange-400 hover:underline"
            onClick={() => router.push("/lookbook")}
          >
            LookBook
          </button>
          <button
            className="hover:text-orange-400 hover:underline"
            onClick={() => router.push("/arrivals")}
          >
            New Arrivals
          </button>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-6 text-white font-medium">
          {isUserLogin ? (
            <button
              className="block w-full text-left text-lg"
              onClick={() => setSidebar(true)}
            >
              Account
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                className="block text-left text-lg"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </button>
              <button
                className="block text-left text-lg"
                onClick={() => router.push("/login")}
              >
                Log In
              </button>
            </div>
          )}

          <button
            className="hover:text-orange-400 flex items-center gap-2"
            onClick={() => {
              if (isUserLogin) router.push("/cart");
              else toast.error("Please login to view cart");
            }}
          >
            Cart
            {items.length > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 rounded-full">
                {items.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden z-50" onClick={() => setOpen(!open)}>
          {open ? (
            <X size={28} />
          ) : (
            <div className="flex gap-1 items-center relative">
              <Menu size={28} />
              {items.length > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full absolute -top-2 -right-4">
                  {items.length}
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-slate-300 shadow-lg p-4 space-y-4 z-40">
          <button
            className="block text-left text-lg hover:bg-amber-600 hover:underline"
            onClick={() => router.push("/shop")}
          >
            Shop
          </button>
          <button
            className="block text-left text-lg hover:bg-amber-600 hover:underline"
            onClick={() => router.push("/lookbook")}
          >
            LookBook
          </button>
          <button
            className="block text-left text-lg hover:bg-amber-600 hover:underline"
            onClick={() => router.push("/arrivals")}
          >
            New Arrivals
          </button>
          <hr className="border-slate-600" />

          {isUserLogin ? (
            <button
              className="block w-full text-left text-lg"
              onClick={() => setSidebar(true)}
            >
              Account
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                className="block text-left text-lg"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </button>
              <button
                className="block text-left text-lg"
                onClick={() => router.push("/login")}
              >
                Log In
              </button>
            </div>
          )}
          <button
            className="hover:text-orange-400 flex items-center gap-2"
            onClick={() => {
              if (isUserLogin) router.push("/cart");
              else toast.error("Please login to view cart");
            }}
          >
            Cart
            {items.length > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 rounded-full">
                {items.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* SIDEBAR */}
      {sidebar && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 md:bg-transparent"
          onClick={() => setSidebar(false)}
        >
          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full md:w-80 h-full p-6 bg-slate-200 shadow-xl relative overflow-auto"
          >
            {/* Close */}
            <button
              className="absolute right-4 top-4"
              onClick={() => setSidebar(false)}
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-6 text-center">
              Account Details
            </h2>

            {/* USER DETAILS */}
            <div className="space-y-4 text-center">
              {user?.photo && (
                <img
                  src={user.photo}
                  className="w-20 h-20 mx-auto rounded-full object-cover border"
                />
              )}

              <p className="text-lg font-medium">{user?.name}</p>

              <p>{user?.email}</p>

              {user?.number && <p>📞 {user.number}</p>}
              {user?.gender && <p>Gender: {user.gender}</p>}

              {/* SETTINGS */}
              <div className="mt-4 text-left px-2">
                <button
                  onClick={logout}
                  className="w-full mt-4 bg-red-500 text-white p-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default EcommerceHeader;

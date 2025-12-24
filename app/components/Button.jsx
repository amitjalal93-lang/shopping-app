"use client";

import { useAuthStore } from "@/store/authStore";
import React from "react";
import { toast } from "react-toastify";

const Button = ({
  text,
  type = "primary",
  onClick,
  checkLogin = true,
  className = "",
}) => {
  const { user } = useAuthStore();

  let btnClass =
    "bg-orange-600 hover:bg-orange-700 py-2 rounded-lg font-semibold text-white px-4 w-full";

  if (type === "secondary") {
    btnClass =
      "rounded-lg font-semibold text-black bg-gray-100 hover:bg-gray-200 py-2 px-4 w-full";
  }

  const handleClick = (e) => {
    e.stopPropagation();

    if (!user && checkLogin) {
      return toast.error("Please login to proceed");
    }

    onClick();
  };

  return (
    <button className={`${btnClass} ${className}`} onClick={handleClick}>
      {text}
    </button>
  );
};

export default Button;

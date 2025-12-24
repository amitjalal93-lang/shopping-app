"use client";

import "./globals.css";
import Sidebar from "@/app/components/Sidebar";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Categoris from "./components/Categoris";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const { checkAuth } = useAuthStore();
  const { fetchCart } = useCartStore();

  // sidebar hide
  const hideSidebarPages = [
    "/login",
    "/register",
    "/forgot",
    "/cart",
    "/admin/dashboard",
    "/admin/category",
  ];
  const hideSidebar = hideSidebarPages.includes(pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <html lang="en">
      <body>
        {!hideSidebar && (
          <>
            <Sidebar />
            <Categoris />
          </>
        )}
        <div className={hideSidebar ? "" : "mt-33"}>{children}</div>
        <ToastContainer />
      </body>
    </html>
  );
}

"use client";

import "./globals.css";
import Sidebar from "@/app/components/Sidebar";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  const pathname = usePathname();

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

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {!hideSidebar && <Sidebar />}
          <div className={hideSidebar ? "" : "mt-20"}>{children}</div>
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}

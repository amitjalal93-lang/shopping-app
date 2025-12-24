"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <div className="flex h-screen">
            <div
              className="fixed bottom-0  left-0  w-full md:static md:w-[250px] bg-[#1e1e1e] flex  md:flex-col flex-row
    justify-between   md:justify-start md:gap-6  items-center  py-3 md:py-6 text-white"
            >
              <h1 className="text-2xl font-bold hidden md:block">Dashboard</h1>
              <button
                className="hover:text-blue-400 hover:bg-gray-700 px-4 py-2 rounded-lg flex gap-2 items-center"
                onClick={() => router.push("/admin/dashboard")}
              >
                <span>🏠</span>
                Products
              </button>

              <button
                className="hover:text-blue-400 hover:bg-gray-700 px-4 py-2 rounded-lg flex gap-2 items-center"
                onClick={() => router.push("/admin/category")}
              >
                <span>🔍</span>
                Category
              </button>
              <button
                className="hover:text-blue-400 hover:bg-gray-700 px-4 py-2 rounded-lg "
                onClick={() => {
                  localStorage.clear();
                  router.push("/");
                }}
              >
                Logout
              </button>
            </div>
            {/* produts items */}
            <div className="flex-1 h-full overflow-y-auto">{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}

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
            <div className="h-full w-[250px] bg-[#1e1e1e] flex flex-col items-center py-6 gap-8 text-white">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <button
                className="hover:text-blue-400 hover:bg-gray-700 px-4 py-2 rounded-lg"
                onClick={() => router.push("/admin/dashboard")}
              >
                🏠Products
              </button>

              <button
                className="hover:text-blue-400 hover:bg-gray-700 px-4 py-2 rounded-lg"
                onClick={() => router.push("/admin/category")}
              >
                🔍Category
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

"use client"

import { usePathname } from "next/navigation"
import AdminSidebar from "@/components/AdminSidebar"
import AdminAuthProvider from "@/components/AdminAuthProvider"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        // Login page - no sidebar
        <>{children}</>
      ) : (
        // Dashboard pages - with sidebar
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
          <AdminSidebar />

          {/* Main Content */}
          <main className="flex-1 w-full lg:ml-64 min-w-0">
            <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">{children}</div>
          </main>
        </div>
      )}
    </AdminAuthProvider>
  )
}

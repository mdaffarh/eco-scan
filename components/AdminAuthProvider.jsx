"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminAuthProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isAuth = localStorage.getItem("adminAuth") === "true"

      // If not on login page and not authenticated, redirect to login
      if (!isAuth && pathname !== "/admin/login") {
        router.push("/admin/login")
      }
      // If on login page and authenticated, redirect to dashboard
      else if (isAuth && pathname === "/admin/login") {
        router.push("/admin")
      }

      setIsAuthenticated(isAuth)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If on login page or authenticated, show the page
  if (pathname === "/admin/login" || isAuthenticated) {
    return <>{children}</>
  }

  // Otherwise, don't render anything (will redirect)
  return null
}

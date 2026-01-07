/**
 * API Configuration
 * Centralized API base URL configuration
 * Backend is now integrated into Next.js, so we use relative URLs
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Admin endpoints
  USERS: "/api/admin/users",
  WASTE_LOGS: "/api/admin/waste-logs",
  BINS: "/api/admin/bins",

  // Stats endpoint
  STATS: "/api/stats/stats",
}

/**
 * Helper function to build full API URL
 * For local Next.js API routes, use relative URLs
 * For external backend, use absolute URLs
 */
export const getApiUrl = (endpoint, params = {}) => {
  // If no base URL (using local Next.js API routes), build relative URL
  if (!API_BASE_URL) {
    const url = new URL(endpoint, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })
    // Return relative path with query params
    return url.pathname + url.search
  }

  // If base URL exists (external backend), build absolute URL
  const url = new URL(endpoint, API_BASE_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}

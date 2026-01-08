import { useState, useEffect } from "react"

/**
 * Custom SWR-like hook for data fetching with caching and revalidation
 * @param {string} key - Unique key for the request
 * @param {Function} fetcher - Function that returns a promise with data
 * @param {Object} options - Configuration options
 * @returns {Object} { data, error, isLoading, mutate }
 */
export function useSWR(key, fetcher, options = {}) {
  const { revalidateOnFocus = false, revalidateOnReconnect = false, refreshInterval = 0, dedupingInterval = 2000 } = options

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cache to store data and timestamps
  const cache = typeof window !== "undefined" ? (window.__SWR_CACHE__ = window.__SWR_CACHE__ || {}) : {}
  const cacheKey = key

  const fetchData = async (force = false) => {
    // Check cache first
    const cached = cache[cacheKey]
    const now = Date.now()

    if (cached && !force) {
      // Use cached data if within deduping interval
      if (now - cached.timestamp < dedupingInterval) {
        setData(cached.data)
        setIsLoading(false)
        return cached.data
      }
    }

    try {
      setIsLoading(true)
      const result = await fetcher()

      // Update cache
      cache[cacheKey] = {
        data: result,
        timestamp: now,
      }

      setData(result)
      setError(null)
      return result
    } catch (err) {
      setError(err)
      console.error("SWR fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Manual revalidation
  const mutate = async newData => {
    if (newData !== undefined) {
      setData(newData)
      cache[cacheKey] = {
        data: newData,
        timestamp: Date.now(),
      }
    } else {
      await fetchData(true)
    }
  }

  useEffect(() => {
    if (!key) return

    // Initial fetch
    fetchData()

    // Set up refresh interval
    let intervalId
    if (refreshInterval > 0) {
      intervalId = setInterval(() => {
        fetchData(true)
      }, refreshInterval)
    }

    // Revalidate on focus
    const handleFocus = () => {
      if (revalidateOnFocus) {
        fetchData(true)
      }
    }

    // Revalidate on reconnect
    const handleOnline = () => {
      if (revalidateOnReconnect) {
        fetchData(true)
      }
    }

    if (revalidateOnFocus) {
      window.addEventListener("focus", handleFocus)
    }

    if (revalidateOnReconnect) {
      window.addEventListener("online", handleOnline)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (revalidateOnFocus) {
        window.removeEventListener("focus", handleFocus)
      }
      if (revalidateOnReconnect) {
        window.removeEventListener("online", handleOnline)
      }
    }
  }, [key])

  return { data, error, isLoading, mutate }
}

/**
 * Hook for fetching user waste logs with caching
 */
export function useWasteLogs(userId) {
  return useSWR(
    userId ? `/api/waste-logs?userId=${userId}` : null,
    async () => {
      const res = await fetch(`/api/waste-logs?userId=${userId}`)
      const data = await res.json()
      return data.data || []
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  )
}

/**
 * Hook for fetching user data with caching
 */
export function useUserData(userId) {
  return useSWR(
    userId ? `/api/user/${userId}` : null,
    async () => {
      const res = await fetch(`/api/user/${userId}`)
      const data = await res.json()
      return data.user
    },
    {
      revalidateOnFocus: true,
      dedupingInterval: 60000, // 1 minute
    }
  )
}

/**
 * Hook for fetching dashboard stats with caching
 */
export function useDashboardStats(timeFilter = "all") {
  return useSWR(
    `/api/stats/stats?timeFilter=${timeFilter}`,
    async () => {
      const res = await fetch(`/api/stats/stats?timeFilter=${timeFilter}`)
      const data = await res.json()
      return data.data
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
      dedupingInterval: 30000,
    }
  )
}

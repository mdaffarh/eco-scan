/**
 * Simple in-memory cache for API responses
 * Helps reduce unnecessary API calls and improve performance
 */

class CacheManager {
  constructor() {
    this.cache = new Map()
    this.timestamps = new Map()
  }

  /**
   * Get cached data if it exists and hasn't expired
   * @param {string} key - Cache key
   * @param {number} maxAge - Maximum age in milliseconds (default: 5 minutes)
   * @returns {any|null} Cached data or null if expired/not found
   */
  get(key, maxAge = 5 * 60 * 1000) {
    if (!this.cache.has(key)) {
      return null
    }

    const timestamp = this.timestamps.get(key)
    const now = Date.now()

    // Check if cache has expired
    if (now - timestamp > maxAge) {
      this.cache.delete(key)
      this.timestamps.delete(key)
      return null
    }

    return this.cache.get(key)
  }

  /**
   * Set cache data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  set(key, data) {
    this.cache.set(key, data)
    this.timestamps.set(key, Date.now())
  }

  /**
   * Clear specific cache key
   * @param {string} key - Cache key to clear
   */
  clear(key) {
    this.cache.delete(key)
    this.timestamps.delete(key)
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear()
    this.timestamps.clear()
  }

  /**
   * Get cache size
   * @returns {number} Number of cached items
   */
  size() {
    return this.cache.size
  }
}

// Create singleton instance
const cacheManager = new CacheManager()

/**
 * Fetch with caching
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} cacheTime - Cache duration in milliseconds (default: 5 minutes)
 * @returns {Promise<any>} Response data
 */
export async function fetchWithCache(url, options = {}, cacheTime = 5 * 60 * 1000) {
  const cacheKey = `${url}-${JSON.stringify(options)}`

  // Try to get from cache
  const cachedData = cacheManager.get(cacheKey, cacheTime)
  if (cachedData !== null) {
    console.log(`✅ Cache hit for: ${url}`)
    return cachedData
  }

  // Fetch from API
  console.log(`🌐 Fetching from API: ${url}`)
  const response = await fetch(url, options)
  const data = await response.json()

  // Store in cache
  cacheManager.set(cacheKey, data)

  return data
}

/**
 * Clear cache for specific URL pattern
 * @param {string} pattern - URL pattern to match (supports wildcards with *)
 */
export function clearCachePattern(pattern) {
  const regex = new RegExp(pattern.replace(/\*/g, ".*"))

  for (const key of cacheManager.cache.keys()) {
    if (regex.test(key)) {
      cacheManager.clear(key)
    }
  }
}

/**
 * Invalidate cache when data is mutated
 * @param {string[]} patterns - Array of URL patterns to invalidate
 */
export function invalidateCache(patterns) {
  patterns.forEach(pattern => clearCachePattern(pattern))
}

export default cacheManager

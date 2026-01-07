/**
 * Custom hook for pagination logic
 */
import { useState, useEffect, useMemo } from "react"
import { PAGINATION } from "@/lib/constants"

export const usePagination = (items, itemsPerPage = PAGINATION.DEFAULT_ITEMS_PER_PAGE) => {
  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE)

  // Calculate pagination values
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Get current page items
  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex)
  }, [items, startIndex, endIndex])

  // Navigate to specific page
  const goToPage = page => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1)
  }, [items.length])

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    startIndex,
    endIndex,
  }
}

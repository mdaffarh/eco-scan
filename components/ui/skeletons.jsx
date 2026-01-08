import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-md space-y-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="flex items-end justify-between h-64 space-x-2">
        {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
          <Skeleton key={i} className="w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#1e3a8a] p-8 rounded-2xl text-white">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full bg-white/20" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-48 bg-white/20" />
            <Skeleton className="h-4 w-64 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-md space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Activity List */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      {/* Table Header */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex space-x-4">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ImageGallerySkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex space-x-2 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}

export function ScanResultSkeleton() {
  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <Skeleton className="w-full aspect-video rounded-2xl" />

      {/* Result Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="pt-4 space-y-2">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>
    </div>
  )
}

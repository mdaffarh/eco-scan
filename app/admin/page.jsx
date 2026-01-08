"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Users, Trash2, TrendingUp, Activity, Award, Loader2, BarChart3, Target, Calendar, MapPin, PackageCheck } from "lucide-react"
import { getApiUrl, API_ENDPOINTS } from "@/lib/api"
import { DashboardSkeleton } from "@/components/ui/skeletons"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import heavy chart components
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
})
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false })
const LineChart = dynamic(() => import("recharts").then(mod => mod.LineChart), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
})
const Line = dynamic(() => import("recharts").then(mod => mod.Line), { ssr: false })
const PieChart = dynamic(() => import("recharts").then(mod => mod.PieChart), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
})
const Pie = dynamic(() => import("recharts").then(mod => mod.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then(mod => mod.Cell), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false })
const Legend = dynamic(() => import("recharts").then(mod => mod.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false })

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    fetchDashboardStats()
  }, [timeFilter])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(getApiUrl(API_ENDPOINTS.STATS, { timeFilter }))
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    )
  }

  const statsCards = [
    {
      title: "Total Scans",
      value: stats?.stats?.totalScans || 0,
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: stats?.stats?.totalUsers || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Bins",
      value: stats?.stats?.totalBins || 0,
      icon: Trash2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Level",
      value: stats?.stats?.avgLevel?.toFixed(1) || "0",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total XP",
      value: (stats?.stats?.totalXP || 0).toLocaleString(),
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Avg Confidence",
      value: stats?.stats?.avgConfidence ? `${(stats.stats.avgConfidence > 1 ? stats.stats.avgConfidence : stats.stats.avgConfidence * 100).toFixed(1)}%` : "0%",
      icon: Target,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
  ]

  const formatTimeAgo = timestamp => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = Math.floor((now - time) / 1000) // seconds

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  // Calculate waste type distribution percentages
  const wasteTypeDistribution = stats?.wasteTypeDistribution || []
  const totalWaste = wasteTypeDistribution.reduce((sum, item) => sum + item.count, 0)
  const wasteTypes = wasteTypeDistribution.map(item => ({
    type: item._id,
    count: item.count,
    percentage: totalWaste > 0 ? Math.round((item.count / totalWaste) * 100) : 0,
  }))

  // Prepare data for charts
  const pieColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]

  const pieChartData = wasteTypeDistribution.map((item, index) => ({
    name: item._id,
    value: item.count,
    fill: pieColors[index % pieColors.length],
  }))

  const fakultasChartData = (stats?.fakultasDistribution || []).map(item => ({
    name: item._id,
    scans: item.count,
  }))

  const dailyScansData = (stats?.dailyScans || []).map(item => ({
    date: new Date(item._id).toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
    scans: item.count,
  }))

  const topUsersData = (stats?.topUsers || []).map(user => ({
    name: user.username,
    xp: user.total_xp,
    level: user.level,
  }))

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hourData = (stats?.scansByHour || []).find(h => h._id === i)
    return {
      hour: `${i}:00`,
      scans: hourData ? hourData.count : 0,
    }
  })

  // Bin distribution data
  const binsByFakultasData = (stats?.binsByFakultas || []).map(item => ({
    name: item._id,
    locations: item.count,
  }))

  const binTypesData = (stats?.binTypesDistribution || []).map((item, index) => ({
    name: item._id,
    value: item.count,
    fill: pieColors[index % pieColors.length],
  }))

  // Prepare bin types per fakultas for stacked bar chart
  const allBinTypes = [...new Set((stats?.binTypesPerFakultas || []).flatMap(f => f.binTypes.map(b => b.type)))]
  const binTypesPerFakultasData = (stats?.binTypesPerFakultas || []).map(fakultas => {
    const data = { fakultas: fakultas._id }
    fakultas.binTypes.forEach(bt => {
      data[bt.type] = bt.count
    })
    return data
  })

  const binTypeColors = {
    Organik: "#10b981",
    Anorganik: "#3b82f6",
    "Botol Plastik": "#06b6d4",
    Kertas: "#fbbf24",
    Residu: "#6b7280",
    B3: "#ef4444",
    Kaca: "#8b5cf6",
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Welcome to EcoScan Admin Panel</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">{stat.title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 sm:mt-2">{stat.value}</h3>
                  </div>
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-full flex-shrink-0`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ========== SCAN ACTIVITY ANALYTICS ========== */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-blue-200 pb-2 sm:pb-3 mt-6 sm:mt-8">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Scan Activity Analytics</h2>
        </div>

        {/* Charts Row 1 */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4 max-h-[300px] overflow-y-auto">
                {(stats?.recentActivities || []).slice(0, 5).map(activity => (
                  <div key={activity._id} className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{activity.username}</p>
                      <p className="text-xs sm:text-sm text-slate-600 truncate">Scanned {activity.waste_type} waste</p>
                      <p className="text-xs text-slate-500 mt-1">Confidence: {activity.confidence > 1 ? activity.confidence.toFixed(1) : (activity.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">+{activity.xp_earned || 0} XP</span>
                      <p className="text-xs text-slate-500 mt-1 whitespace-nowrap">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
                {(!stats?.recentActivities || stats.recentActivities.length === 0) && <p className="text-center text-slate-500 py-4">No recent activities</p>}
              </div>
            </CardContent>
          </Card>
          {/* Waste Type Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-purple-600" />
                Waste Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500 py-12">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Scans Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Daily Scan Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dailyScansData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyScansData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500 py-12">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Fakultas Distribution Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Scans by Fakultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fakultasChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fakultasChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scans" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500 py-12">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Hourly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-600" />
                Scan Activity by Hour (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scans" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ========== BIN DISTRIBUTION ANALYTICS ========== */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-green-200 pb-3 mt-8">
          <MapPin className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-slate-900">Bin Distribution Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bins by Fakultas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Bin Locations by Fakultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {binsByFakultasData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={binsByFakultasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="locations" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500 py-12">No bin data available</p>
              )}
            </CardContent>
          </Card>

          {/* Bin Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-purple-600" />
                Bin Types Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {binTypesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={binTypesData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                      {binTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500 py-12">No bin types available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bin Types per Fakultas - Stacked Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Bin Types Distribution per Fakultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {binTypesPerFakultasData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={binTypesPerFakultasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fakultas" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {allBinTypes.map((binType, index) => (
                    <Bar key={binType} dataKey={binType} stackId="a" fill={binTypeColors[binType] || pieColors[index % pieColors.length]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-slate-500 py-12">No bin distribution data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ========== USER ANALYTICS ========== */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b-2 border-orange-200 pb-3 mt-8">
          <Award className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-slate-900">User Analytics</h2>
        </div>

        {/* Top Users Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-600" />
              Top 5 Users by XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topUsersData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topUsersData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="xp" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-slate-500 py-12">No users yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

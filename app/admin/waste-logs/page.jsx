"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, Eye, Loader2 } from "lucide-react"
import { getApiUrl, API_ENDPOINTS } from "@/lib/api"
import { WASTE_TYPES, FAKULTAS_LIST } from "@/lib/constants"
import { usePagination } from "@/hooks/usePagination"
import { TableSkeleton } from "@/components/ui/skeletons"

export default function WasteLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [wasteLogs, setWasteLogs] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    user_id: "",
    waste_type: "",
    confidence: "",
    fakultas: "",
    lokasi_id: "",
  })

  // Fetch data
  useEffect(() => {
    fetchWasteLogs()
    fetchUsers()
  }, [])

  const fetchWasteLogs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(getApiUrl(API_ENDPOINTS.WASTE_LOGS))
      const result = await response.json()

      if (result.success) {
        setWasteLogs(result.data)
      }
    } catch (error) {
      console.error("Error fetching waste logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.USERS))
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  // Get username from user_id
  const getUsernameById = userId => {
    const user = users.find(u => u._id === userId)
    return user?.username || "Unknown User"
  }

  const filteredLogs = wasteLogs.filter(log => {
    const username = getUsernameById(log.user_id)
    return username.toLowerCase().includes(searchTerm.toLowerCase()) || log.waste_type?.toLowerCase().includes(searchTerm.toLowerCase()) || log.fakultas?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Use pagination hook
  const { currentPage, totalPages, currentItems: currentLogs, goToPage, startIndex, endIndex } = usePagination(filteredLogs)

  const handleAdd = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.WASTE_LOGS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.user_id,
          waste_type: formData.waste_type,
          confidence: parseFloat(formData.confidence),
          fakultas: formData.fakultas,
          lokasi_id: formData.lokasi_id,
          image_url: formData.image_url,
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchWasteLogs()
        setIsAddDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error adding waste log:", error)
      alert("Failed to add waste log")
    }
  }

  const handleEdit = async () => {
    try {
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.WASTE_LOGS}/${selectedLog._id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.user_id,
          waste_type: formData.waste_type,
          confidence: parseFloat(formData.confidence),
          fakultas: formData.fakultas,
          lokasi_id: formData.lokasi_id,
          image_url: formData.image_url,
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchWasteLogs()
        setIsEditDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error updating waste log:", error)
      alert("Failed to update waste log")
    }
  }

  const handleDelete = async id => {
    if (!confirm("Are you sure you want to delete this log?")) return

    try {
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.WASTE_LOGS}/${id}`), {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        await fetchWasteLogs()
      }
    } catch (error) {
      console.error("Error deleting waste log:", error)
      alert("Failed to delete waste log")
    }
  }

  const openEditDialog = log => {
    setSelectedLog(log)
    setFormData({
      user_id: log.user_id,
      waste_type: log.waste_type,
      confidence: log.confidence.toString(),
      fakultas: log.fakultas,
      lokasi_id: log.lokasi_id,
      image_url: log.image_url || "",
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = log => {
    setSelectedLog(log)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      user_id: "",
      waste_type: "",
      confidence: "",
      fakultas: "",
      lokasi_id: "",
      image_url: "",
    })
    setSelectedLog(null)
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const getWasteTypeBadgeColor = type => {
    const colors = {
      Plastik: "bg-blue-100 text-blue-800",
      Organik: "bg-green-100 text-green-800",
      Kertas: "bg-yellow-100 text-yellow-800",
      Logam: "bg-gray-100 text-gray-800",
      Kaca: "bg-purple-100 text-purple-800",
    }
    return colors[type] || "bg-slate-100 text-slate-800"
  }

  return (
    <div className="space-y-4 md:space-y-6 px-3 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Waste Logs</h1>
          <p className="text-sm md:text-base text-slate-600 mt-1">Manage waste scan history</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Log
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by username or waste type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={10} cols={7} />
      ) : (
        <Card>
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-lg md:text-xl">All Waste Logs ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent className="px-0 md:px-6 pb-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">User</TableHead>
                    <TableHead className="min-w-[120px]">Waste Type</TableHead>
                    <TableHead className="min-w-[100px]">Confidence</TableHead>
                    <TableHead className="min-w-[100px]">XP Earned</TableHead>
                    <TableHead className="min-w-[100px]">Fakultas</TableHead>
                    <TableHead className="min-w-[150px]">Timestamp</TableHead>
                    <TableHead className="text-right min-w-[110px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500">
                        No logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentLogs.map(log => (
                      <TableRow key={log._id}>
                        <TableCell className="font-medium">{getUsernameById(log.user_id)}</TableCell>
                        <TableCell>
                          <Badge className={getWasteTypeBadgeColor(log.waste_type)}>{log.waste_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-green-600">{log.confidence > 1 ? log.confidence.toFixed(1) : (log.confidence * 100).toFixed(1)}%</span>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{log.fakultas}</TableCell>
                        <TableCell className="text-sm text-slate-600">{log.lokasi_id}</TableCell>
                        <TableCell className="text-sm text-slate-600">{formatDate(log.timestamp)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openViewDialog(log)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(log)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(log._id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-slate-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 1) return true
                    return false
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center gap-2">
                      {index > 0 && array[index - 1] !== page - 1 && <span className="text-slate-400">...</span>}
                      <Button variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => goToPage(page)} className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}>
                        {page}
                      </Button>
                    </div>
                  ))}
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Waste Log</DialogTitle>
            <DialogDescription>Add a new waste scan log to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">User</Label>
              <Select value={formData.user_id} onValueChange={value => setFormData({ ...formData, user_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waste_type">Waste Type</Label>
              <Select value={formData.waste_type} onValueChange={value => setFormData({ ...formData, waste_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  {WASTE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence (0-1)</Label>
              <Input id="confidence" type="number" step="0.01" min="0" max="1" placeholder="0.95" value={formData.confidence} onChange={e => setFormData({ ...formData, confidence: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fakultas">Fakultas</Label>
              <Select value={formData.fakultas} onValueChange={value => setFormData({ ...formData, fakultas: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fakultas" />
                </SelectTrigger>
                <SelectContent>
                  {FAKULTAS_LIST.map(fak => (
                    <SelectItem key={fak} value={fak}>
                      {fak}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lokasi_id">Lokasi ID</Label>
              <Input id="lokasi_id" type="text" placeholder="FPTI_COE" value={formData.lokasi_id} onChange={e => setFormData({ ...formData, lokasi_id: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              Add Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Waste Log</DialogTitle>
            <DialogDescription>Update waste log information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_user_id">User</Label>
              <Select value={formData.user_id} onValueChange={value => setFormData({ ...formData, user_id: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_waste_type">Waste Type</Label>
              <Select value={formData.waste_type} onValueChange={value => setFormData({ ...formData, waste_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WASTE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_confidence">Confidence (0-1)</Label>
              <Input id="edit_confidence" type="number" step="0.01" min="0" max="1" value={formData.confidence} onChange={e => setFormData({ ...formData, confidence: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_fakultas">Fakultas</Label>
              <Select value={formData.fakultas} onValueChange={value => setFormData({ ...formData, fakultas: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FAKULTAS_LIST.map(fak => (
                    <SelectItem key={fak} value={fak}>
                      {fak}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_lokasi_id">Lokasi ID</Label>
              <Input id="edit_lokasi_id" type="text" value={formData.lokasi_id} onChange={e => setFormData({ ...formData, lokasi_id: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waste Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <p className="text-sm text-slate-600">{selectedLog._id}</p>
              </div>
              <div className="space-y-2">
                <Label>User</Label>
                <p className="text-sm font-medium">{getUsernameById(selectedLog.user_id)}</p>
                <p className="text-xs text-slate-500">ID: {selectedLog.user_id}</p>
              </div>
              <div className="space-y-2">
                <Label>Waste Type</Label>
                <Badge className={getWasteTypeBadgeColor(selectedLog.waste_type)}>{selectedLog.waste_type}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Confidence Score</Label>
                <p className="text-sm font-medium text-green-600">{(selectedLog.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="space-y-2">
                <Label>Fakultas</Label>
                <p className="text-sm text-slate-600">{selectedLog.fakultas}</p>
              </div>
              <div className="space-y-2">
                <Label>Lokasi ID</Label>
                <p className="text-sm text-slate-600">{selectedLog.lokasi_id}</p>
              </div>
              <div className="space-y-2">
                <Label>XP Earned</Label>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">+{selectedLog.xp_earned} XP</span>
              </div>
              <div className="space-y-2">
                <Label>Timestamp</Label>
                <p className="text-sm text-slate-600">{formatDate(selectedLog.timestamp)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

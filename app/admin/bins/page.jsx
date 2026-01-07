"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Pencil, Trash2, Search, Eye, MapPin, Loader2, Image as ImageIcon } from "lucide-react"
import { getApiUrl, API_ENDPOINTS, API_BASE_URL } from "@/lib/api"
import { WASTE_TYPES, FAKULTAS_LIST } from "@/lib/constants"
import { usePagination } from "@/hooks/usePagination"

export default function BinsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedBin, setSelectedBin] = useState(null)
  const [bins, setBins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [formData, setFormData] = useState({
    value: "",
    label: "",
    bins: [],
    description: "",
    fakultas: "",
    image_url: "",
  })

  // Fetch bins from API
  useEffect(() => {
    fetchBins()
  }, [])

  const fetchBins = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(getApiUrl(API_ENDPOINTS.BINS))
      const result = await response.json()

      if (result.success) {
        setBins(result.data)
      }
    } catch (error) {
      console.error("Error fetching bins:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBins = bins.filter(bin => bin.value?.toLowerCase().includes(searchTerm.toLowerCase()) || bin.label?.toLowerCase().includes(searchTerm.toLowerCase()))

  // Use pagination hook
  const { currentPage, totalPages, currentItems: currentBins, goToPage, startIndex, endIndex } = usePagination(filteredBins)

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBinTypeToggle = type => {
    setFormData(prev => ({
      ...prev,
      bins: prev.bins.includes(type) ? prev.bins.filter(b => b !== type) : [...prev.bins, type],
    }))
  }

  const handleAdd = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("value", formData.value)
      formDataToSend.append("label", formData.label)
      formDataToSend.append("bins", JSON.stringify(formData.bins))
      formDataToSend.append("description", formData.description)
      formDataToSend.append("fakultas", formData.fakultas)

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.BINS), {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        await fetchBins()
        setIsAddDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error adding bin location:", error)
    }
  }

  const handleEdit = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("value", formData.value)
      formDataToSend.append("label", formData.label)
      formDataToSend.append("bins", JSON.stringify(formData.bins))
      formDataToSend.append("description", formData.description)
      formDataToSend.append("fakultas", formData.fakultas)

      if (imageFile) {
        formDataToSend.append("image", imageFile)
      } else {
        formDataToSend.append("image_url", formData.image_url)
      }

      const response = await fetch(getApiUrl(`${API_ENDPOINTS.BINS}/${selectedBin._id}`), {
        method: "PUT",
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        await fetchBins()
        setIsEditDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error updating bin location:", error)
    }
  }

  const handleDelete = async id => {
    if (!confirm("Are you sure you want to delete this bin location?")) return

    try {
      const response = await fetch(getApiUrl(`${API_ENDPOINTS.BINS}/${id}`), {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        await fetchBins()
      }
    } catch (error) {
      console.error("Error deleting bin location:", error)
    }
  }

  const openEditDialog = bin => {
    setSelectedBin(bin)
    setFormData({
      value: bin.value,
      label: bin.label,
      bins: bin.bins || [],
      description: bin.description,
      fakultas: bin.fakultas,
      image_url: bin.image_url,
    })
    setImagePreview(bin.image_url || "")
    setIsEditDialogOpen(true)
  }

  const openViewDialog = bin => {
    setSelectedBin(bin)
    setIsViewDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      value: "",
      label: "",
      bins: [],
      description: "",
      fakultas: "",
      image_url: "",
    })
    setImageFile(null)
    setImagePreview("")
    setSelectedBin(null)
  }

  const getBinTypeBadgeColor = type => {
    const colors = {
      Organik: "bg-green-100 text-green-800",
      Anorganik: "bg-blue-100 text-blue-800",
      "Botol Plastik": "bg-cyan-100 text-cyan-800",
      Kertas: "bg-yellow-100 text-yellow-800",
      Residu: "bg-gray-100 text-gray-800",
      B3: "bg-red-100 text-red-800",
      "Tidak Ada Label": "bg-slate-100 text-slate-800",
    }
    return colors[type] || "bg-slate-100 text-slate-800"
  }

  return (
    <div className="space-y-4 md:space-y-6 px-3 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Lokasi Tempat Sampah</h1>
          <p className="text-sm md:text-base text-slate-600 mt-1">Kelola kumpulan tempat sampah per lokasi</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Lokasi
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Cari berdasarkan ID, nama, fakultas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Lokasi Tersedia ({filteredBins.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">Gambar</TableHead>
                  <TableHead className="min-w-[100px]">ID Lokasi</TableHead>
                  <TableHead className="min-w-[150px]">Nama Lokasi</TableHead>
                  <TableHead className="min-w-[100px]">Fakultas</TableHead>
                  <TableHead className="min-w-[200px]">Jenis Tempat Sampah</TableHead>
                  <TableHead className="min-w-[200px]">Deskripsi</TableHead>
                  <TableHead className="text-right min-w-[110px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
                      <p className="text-slate-500 mt-2">Loading locations...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredBins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500">
                      No locations found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBins.map(bin => (
                    <TableRow key={bin._id}>
                      <TableCell>
                        {bin.image_url ? (
                          <img src={`${API_BASE_URL}${bin.image_url}`} alt={bin.label} className="w-16 h-16 object-cover rounded-lg border" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{bin.value}</TableCell>
                      <TableCell className="font-medium">{bin.label}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{bin.fakultas}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {bin.bins?.map((type, idx) => (
                            <Badge key={idx} className={getBinTypeBadgeColor(type)}>
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-xs truncate">{bin.description}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openViewDialog(bin)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(bin)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(bin._id)}>
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

          {/* Pagination */}
          {filteredBins.length > 0 && (
            <div className="mt-4 px-4 md:px-0 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredBins.length)} of {filteredBins.length} locations
              </p>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </Button>

                {/* Page numbers - hide on very small screens */}
                <div className="hidden sm:flex gap-1">
                  {currentPage > 2 && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => goToPage(1)}>
                        1
                      </Button>
                      {currentPage > 3 && <span className="px-2 py-1">...</span>}
                    </>
                  )}

                  {currentPage > 1 && (
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)}>
                      {currentPage - 1}
                    </Button>
                  )}

                  <Button variant="default" size="sm" className="bg-green-600">
                    {currentPage}
                  </Button>

                  {currentPage < totalPages && (
                    <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)}>
                      {currentPage + 1}
                    </Button>
                  )}

                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && <span className="px-2 py-1">...</span>}
                      <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)}>
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Lokasi Baru</DialogTitle>
            <DialogDescription>Tambahkan kumpulan tempat sampah untuk lokasi tertentu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">ID Lokasi *</Label>
              <Input id="value" placeholder="FIP_BESAR" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value.toUpperCase() })} />
              <p className="text-xs text-slate-500">Format: FAKULTAS_NAMA (contoh: FIP_BESAR)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Nama Lokasi *</Label>
              <Input id="label" placeholder="FIP Besar" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fakultas">Fakultas *</Label>
              <Select value={formData.fakultas} onValueChange={value => setFormData({ ...formData, fakultas: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih fakultas" />
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
              <Label>Jenis Tempat Sampah * (Pilih minimal 1)</Label>
              <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                {WASTE_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={`add-${type}`} checked={formData.bins.includes(type)} onCheckedChange={() => handleBinTypeToggle(type)} />
                    <label htmlFor={`add-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              {formData.bins.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.bins.map((type, idx) => (
                    <Badge key={idx} className={getBinTypeBadgeColor(type)}>
                      {type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea id="description" placeholder="Area utama FIP" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Gambar Lokasi (Opsional)</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}
            >
              Batal
            </Button>
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700" disabled={!formData.value || !formData.label || !formData.fakultas || formData.bins.length === 0 || !formData.description}>
              Tambah Lokasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lokasi</DialogTitle>
            <DialogDescription>Update informasi kumpulan tempat sampah</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_value">ID Lokasi *</Label>
              <Input id="edit_value" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value.toUpperCase() })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_label">Nama Lokasi *</Label>
              <Input id="edit_label" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_fakultas">Fakultas *</Label>
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
              <Label>Jenis Tempat Sampah *</Label>
              <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                {WASTE_TYPES.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={`edit-${type}`} checked={formData.bins.includes(type)} onCheckedChange={() => handleBinTypeToggle(type)} />
                    <label htmlFor={`edit-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              {formData.bins.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.bins.map((type, idx) => (
                    <Badge key={idx} className={getBinTypeBadgeColor(type)}>
                      {type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_description">Deskripsi *</Label>
              <Textarea id="edit_description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_image">Gambar Lokasi</Label>
              <Input id="edit_image" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
              }}
            >
              Batal
            </Button>
            <Button onClick={handleEdit} className="bg-green-600 hover:bg-green-700" disabled={!formData.value || !formData.label || !formData.fakultas || formData.bins.length === 0 || !formData.description}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Lokasi</DialogTitle>
          </DialogHeader>
          {selectedBin && (
            <div className="space-y-4">
              {selectedBin.image_url && (
                <div className="w-full">
                  <img src={selectedBin.image_url} alt={selectedBin.label} className="w-full max-h-48 object-cover rounded-lg border" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID Lokasi</Label>
                  <p className="text-sm font-mono bg-slate-100 p-2 rounded">{selectedBin.value}</p>
                </div>

                <div className="space-y-2">
                  <Label>Nama Lokasi</Label>
                  <p className="text-sm font-medium">{selectedBin.label}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fakultas</Label>
                <Badge variant="outline" className="text-sm">
                  {selectedBin.fakultas}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Jenis Tempat Sampah ({selectedBin.bins?.length || 0})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedBin.bins?.map((type, idx) => (
                    <Badge key={idx} className={getBinTypeBadgeColor(type)}>
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <p className="text-sm text-slate-600">{selectedBin.description}</p>
              </div>

              <div className="space-y-2">
                <Label>Database ID</Label>
                <p className="text-xs text-slate-500 font-mono">{selectedBin._id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dibuat</Label>
                  <p className="text-xs text-slate-500">{new Date(selectedBin.createdAt).toLocaleString("id-ID")}</p>
                </div>

                <div className="space-y-2">
                  <Label>Diupdate</Label>
                  <p className="text-xs text-slate-500">{new Date(selectedBin.updatedAt).toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

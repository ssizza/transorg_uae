"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  FolderPlus,
  Upload,
  Folder,
  Video,
  Grid3X3,
  List,
  Home,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react"
import type { MediaFolder, MediaFile } from "../media-management"
import { CreateFolderDialog } from "../create-folder-dialog"
import { UploadDialog } from "../upload-dialog"
import Image from "next/image" // Fix for next/image recommendation

interface MediaPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (file: MediaFile) => void
  fileType?: "image" | "video" | "all"
  title?: string
  multiple?: boolean
}

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  fileType = "all",
  title = "Select Media",
  multiple = false,
}: MediaPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"])
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Wrap loadData in useCallback to satisfy useEffect dependency
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [foldersRes, filesRes] = await Promise.all([
        fetch(`/api/admin/media/folders?parentId=${currentFolderId || ""}`),
        fetch(`/api/admin/media/files?folderId=${currentFolderId || ""}`),
      ])

      if (foldersRes.ok && filesRes.ok) {
        const foldersData = await foldersRes.json()
        const filesData = await filesRes.json()
        setFolders(foldersData.folders)

        let filteredFiles = filesData.files
        if (fileType !== "all") {
          filteredFiles = filesData.files.filter((file: MediaFile) => file.file_type === fileType)
        }
        setFiles(filteredFiles)
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load media data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [currentFolderId, fileType, toast])

  // Wrap handleSearch in useCallback for dependency tracking
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/media/search?q=${encodeURIComponent(searchQuery)}&folderId=${currentFolderId || ""}`,
      )
      if (res.ok) {
        const data = await res.json()
        setFolders(data.folders)

        let filteredFiles = data.files
        if (fileType !== "all") {
          filteredFiles = data.files.filter((file: MediaFile) => file.file_type === fileType)
        }
        setFiles(filteredFiles)
      }
    } catch {
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [currentFolderId, fileType, searchQuery, toast])

  // Load data when modal opens or folder changes
  useEffect(() => {
    if (open) loadData()
  }, [open, currentFolderId, loadData])

  // Search effect
  useEffect(() => {
    if (!open) return
    if (searchQuery.trim()) handleSearch()
    else loadData()
  }, [searchQuery, open, handleSearch, loadData])

  const handleFileSelect = (file: MediaFile) => {
    if (multiple) {
      setSelectedFiles((prev) =>
        prev.some((f) => f.id === file.id) ? prev.filter((f) => f.id !== file.id) : [...prev, file],
      )
    } else {
      setSelectedFiles([file])
    }
  }

  const handleFolderOpen = (folderId: number, folderName: string) => {
    setCurrentPath([...currentPath, folderName])
    setCurrentFolderId(folderId)
  }

  const handleBreadcrumbClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1)
    setCurrentPath(newPath)
    setCurrentFolderId(index === 0 ? null : currentFolderId)
  }

  const handleUseFiles = () => {
    if (selectedFiles.length === 0) return

    if (multiple) selectedFiles.forEach((file) => onSelect(file))
    else onSelect(selectedFiles[0])

    onOpenChange(false)
    setSelectedFiles([])
    setCurrentPath(["Home"])
    setCurrentFolderId(null)
    setSearchQuery("")
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedFiles([])
    setCurrentPath(["Home"])
    setCurrentFolderId(null)
    setSearchQuery("")
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const breadcrumbItems = currentPath.map((path, index) => ({
    name: path,
    isLast: index === currentPath.length - 1,
  }))

  const totalFiles = files.length

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {/* Header Controls */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b">
            <div className="flex items-center gap-4 flex-1">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="w-4 h-4" />
                {breadcrumbItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-4 h-4" />}
                    <span
                      className={item.isLast ? "text-foreground font-medium" : "hover:text-foreground cursor-pointer"}
                      onClick={() => !item.isLast && handleBreadcrumbClick(index)}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </nav>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total: {totalFiles} files</span>
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsCreateFolderOpen(true)}>
                <FolderPlus className="w-4 h-4 mr-2" /> Add Folder
              </Button>
              <Button size="sm" onClick={() => setIsUploadOpen(true)}>
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
                {folders.map((folder) => (
                  <div
                    key={`folder-${folder.id}`}
                    className="group hover:shadow-md transition-shadow cursor-pointer border rounded-lg p-3"
                    onDoubleClick={() => handleFolderOpen(folder.id, folder.name)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Folder className="w-12 h-12 text-blue-500 mb-2" />
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">{folder.name}</h3>
                      <p className="text-xs text-muted-foreground">{folder.item_count || 0} items</p>
                    </div>
                  </div>
                ))}

                {files.map((file) => {
                  const isSelected = selectedFiles.some((f) => f.id === file.id)
                  return (
                    <div
                      key={`file-${file.id}`}
                      className={`group hover:shadow-md transition-shadow cursor-pointer border rounded-lg p-3 relative ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleFileSelect(file)}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <div className="flex flex-col items-center text-center">
                        <div className="w-full h-16 bg-muted rounded mb-2 flex items-center justify-center overflow-hidden">
                          {file.file_type === "image" ? (
                            <Image
                              src={file.file_url || "/placeholder.svg"}
                              alt={file.alt_text || file.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Video className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="font-medium text-xs mb-1 line-clamp-2 leading-tight">{file.title}</h3>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
                      </div>
                    </div>
                  )
                })}

                {folders.length === 0 && files.length === 0 && !loading && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-muted-foreground">
                      {searchQuery ? `No files match "${searchQuery}"` : "No files found"}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {selectedFiles.length > 0 && (
                <>
                  <Badge variant="secondary">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFiles([])}>
                    unselect
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleUseFiles}
                disabled={selectedFiles.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Use {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}file
                {selectedFiles.length > 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        currentFolderId={currentFolderId}
        onSuccess={loadData}
      />

      <UploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        currentFolderId={currentFolderId}
        onSuccess={loadData}
      />
    </>
  )
}

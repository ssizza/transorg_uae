"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { MediaHeader } from "./media-header"
import { MediaToolbar } from "./media-toolbar"
import { MediaGrid } from "./media-grid"
import { MediaList } from "./media-list"
import { CreateFolderDialog } from "./create-folder-dialog"
import { UploadDialog } from "./upload-dialog"
import { Loader2 } from "lucide-react"

export interface MediaFolder {
  id: number
  name: string
  parent_id: number | null
  level: number
  path: string
  created_at: string
  updated_at: string
  item_count?: number
  size?: string
}

export interface MediaFile {
  id: number
  title: string
  alt_text: string | null
  file_name: string
  file_path: string
  file_url: string
  file_type: "image" | "video"
  file_size: number
  mime_type: string
  folder_id: number | null
  is_used: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export function MediaManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"])
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Use useCallback to memoize functions and prevent exhaustive-deps warnings
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
        setFiles(filesData.files)
      } else {
        toast({
          title: "Error",
          description: "Failed to load media data",
          variant: "destructive",
        })
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
  }, [currentFolderId, toast])

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
        setFiles(data.files)
      } else {
        toast({
          title: "Error",
          description: "Search failed",
          variant: "destructive",
        })
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
  }, [currentFolderId, searchQuery, toast])

  useEffect(() => {
    loadData()
  }, [currentFolderId, loadData])

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch()
    } else {
      loadData()
    }
  }, [searchQuery, handleSearch, loadData])

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    const allIds = [...folders.map((f) => f.id), ...files.map((f) => f.id)]
    setSelectedItems(selectedItems.length === allIds.length ? [] : allIds)
  }

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return

    const fileIds = selectedItems.filter((id) => files.some((f) => f.id === id))
    const folderIds = selectedItems.filter((id) => folders.some((f) => f.id === id))

    try {
      if (fileIds.length > 0) {
        const res = await fetch(`/api/admin/media/files?ids=${fileIds.join(",")}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error)
        }
      }

      for (const folderId of folderIds) {
        const res = await fetch(`/api/admin/media/folders?id=${folderId}`, { method: "DELETE" })
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error)
        }
      }

      toast({
        title: "Success",
        description: `${selectedItems.length} item(s) deleted successfully`,
      })

      setSelectedItems([])
      loadData()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete items",
        variant: "destructive",
      })
    }
  }

  const handleFolderOpen = (folderId: number, folderName: string) => {
    setCurrentPath([...currentPath, folderName])
    setCurrentFolderId(folderId)
    setSelectedItems([])
  }

  const handleBreadcrumbClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1)
    setCurrentPath(newPath)

    if (index === 0) {
      setCurrentFolderId(null)
    } else {
      // TODO: Implement proper breadcrumb folder tracking
      setCurrentFolderId(null)
    }
    setSelectedItems([])
  }

  return (
    <div className="space-y-6">
      <MediaHeader
        currentPath={currentPath}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBreadcrumbClick={handleBreadcrumbClick}
        onCreateFolder={() => setIsCreateFolderOpen(true)}
        onUpload={() => setIsUploadOpen(true)}
      />

      <MediaToolbar
        selectedItems={selectedItems}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        totalItems={folders.length + files.length}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : viewMode === "grid" ? (
        <MediaGrid
          folders={folders}
          files={files}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onFolderOpen={handleFolderOpen}
          onRefresh={loadData}
          searchQuery={searchQuery}
          onCreateFolder={() => setIsCreateFolderOpen(true)}
          onUpload={() => setIsUploadOpen(true)}
        />
      ) : (
        <MediaList
          folders={folders}
          files={files}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onFolderOpen={handleFolderOpen}
          onRefresh={loadData}
        />
      )}

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
    </div>
  )
}

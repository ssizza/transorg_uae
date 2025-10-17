"use client"

import type { MediaFolder, MediaFile } from "./media-management"
import { FolderCard } from "./folder-card"
import { FileCard } from "./file-card"
import { EmptyState } from "./empty-state"

interface MediaGridProps {
  folders: MediaFolder[]
  files: MediaFile[]
  selectedItems: number[]
  onSelectItem: (id: number) => void
  onFolderOpen: (folderId: number, folderName: string) => void
  onRefresh: () => void
  searchQuery: string
  onCreateFolder?: () => void
  onUpload?: () => void
}

export function MediaGrid({
  folders,
  files,
  selectedItems,
  onSelectItem,
  onFolderOpen,
  onRefresh,
  searchQuery,
  onCreateFolder,
  onUpload,
}: MediaGridProps) {
  if (folders.length === 0 && files.length === 0) {
    return <EmptyState searchQuery={searchQuery} onCreateFolder={onCreateFolder} onUpload={onUpload} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {/* Folders */}
      {folders.map((folder) => (
        <FolderCard
          key={`folder-${folder.id}`}
          folder={folder}
          isSelected={selectedItems.includes(folder.id)}
          onSelect={() => onSelectItem(folder.id)}
          onOpen={() => onFolderOpen(folder.id, folder.name)}
          onRefresh={onRefresh}
        />
      ))}

      {/* Files */}
      {files.map((file) => (
        <FileCard
          key={`file-${file.id}`}
          file={file}
          isSelected={selectedItems.includes(file.id)}
          onSelect={() => onSelectItem(file.id)}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )
}

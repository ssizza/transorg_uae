"use client"

import type { MediaFolder, MediaFile } from "./media-management"
import { FolderListItem } from "./folder-list-item"
import { FileListItem } from "./file-list-item"
import { Checkbox } from "@/components/ui/checkbox"

interface MediaListProps {
  folders: MediaFolder[]
  files: MediaFile[]
  selectedItems: number[]
  onSelectItem: (id: number) => void
  onFolderOpen: (folderId: number, folderName: string) => void
  onRefresh: () => void
}

export function MediaList({ folders, files, selectedItems, onSelectItem, onFolderOpen, onRefresh }: MediaListProps) {
  const handleSelectAll = () => {
    // ⚡ you can implement "select all" logic here later
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-1">
          <Checkbox
            checked={selectedItems.length === folders.length + files.length && folders.length + files.length > 0}
            onCheckedChange={handleSelectAll}
          />
        </div>
        <div className="col-span-4">Name</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">Modified</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Folders in list view */}
      {folders.map((folder) => (
        <FolderListItem
          key={`folder-list-${folder.id}`}
          folder={folder}
          isSelected={selectedItems.includes(folder.id)}
          onSelect={() => onSelectItem(folder.id)}
          onOpen={() => onFolderOpen(folder.id, folder.name)}
          onRefresh={onRefresh}
        />
      ))}

      {/* Files in list view */}
      {files.map((file) => (
        <FileListItem
          key={`file-list-${file.id}`}
          file={file}
          isSelected={selectedItems.includes(file.id)}
          onSelect={() => onSelectItem(file.id)}
        />
      ))}
    </div>
  )
}

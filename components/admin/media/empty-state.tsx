"use client"

import { Button } from "@/components/ui/button"
import { HardDrive, FolderPlus, Upload } from "lucide-react"

interface EmptyStateProps {
  searchQuery: string
  onCreateFolder?: () => void
  onUpload?: () => void
}

export function EmptyState({ searchQuery, onCreateFolder, onUpload }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <HardDrive className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">{searchQuery ? "No results found" : "No media files yet"}</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery
          ? `No files or folders match "${searchQuery}"`
          : "Start by creating a folder or uploading your first media files."}
      </p>
      {!searchQuery && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={onCreateFolder}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
          <Button onClick={onUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      )}
    </div>
  )
}


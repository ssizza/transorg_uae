"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ImageIcon, FileVideo, MoreVertical, Edit2, Trash2, Download } from "lucide-react"
import type { MediaFile } from "./media-management"

interface FileListItemProps {
  file: MediaFile
  isSelected: boolean
  onSelect: () => void
}

export function FileListItem({ file, isSelected, onSelect }: FileListItemProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg group">
      <div className="col-span-1">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </div>
      <div className="col-span-4 flex items-center gap-3">
        {file.file_type === "image" ? (
          <ImageIcon className="w-5 h-5 text-green-500" />
        ) : (
          <FileVideo className="w-5 h-5 text-purple-500" />
        )}
        <span className="font-medium">{file.title}</span>
        {file.is_used && (
          <Badge variant="secondary" className="text-xs">
            In Use
          </Badge>
        )}
      </div>
      <div className="col-span-2 flex items-center text-sm text-muted-foreground capitalize">{file.file_type}</div>
      <div className="col-span-2 flex items-center text-sm text-muted-foreground">{formatFileSize(file.file_size)}</div>
      <div className="col-span-2 flex items-center text-sm text-muted-foreground">
        {new Date(file.created_at).toLocaleDateString()}
      </div>
      <div className="col-span-1 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" disabled={file.is_used}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

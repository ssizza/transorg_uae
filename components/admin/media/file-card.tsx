"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Video, MoreVertical, Edit2, Trash2, Download } from "lucide-react"
import type { MediaFile } from "./media-management"

interface FileCardProps {
  file: MediaFile
  isSelected: boolean
  onSelect: () => void
  onRefresh: () => void
}

export function FileCard({ file, isSelected, onSelect, onRefresh }: FileCardProps) {
  const { toast } = useToast()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/media/files?ids=${file.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "File deleted successfully",
        })
        onRefresh()
      } else {
        const error = await res.json()
        throw new Error(error.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.file_url
    link.download = file.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit2 className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                disabled={file.is_used}
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {file.is_used && "(File in use)"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
          <h3 className="font-medium text-xs mb-1 line-clamp-2 leading-tight">
            {file.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.file_size)}
          </p>
          {file.is_used && (
            <Badge variant="secondary" className="text-xs mt-1">
              In Use
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

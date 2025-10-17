"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Folder, MoreVertical, Edit2, Trash2 } from "lucide-react"
import type { MediaFolder } from "./media-management"

interface FolderCardProps {
  folder: MediaFolder
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
  onRefresh: () => void
}

export function FolderCard({ folder, isSelected, onSelect, onOpen, onRefresh }: FolderCardProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(folder.name)
  const { toast } = useToast()

  const handleRename = async () => {
    if (!renameValue.trim()) return

    try {
      const res = await fetch("/api/admin/media/folders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: folder.id, name: renameValue.trim() }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Folder renamed successfully",
        })
        setIsRenaming(false)
        onRefresh()
      } else {
        const error = await res.json()
        throw new Error(error.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to rename folder",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/media/folders?id=${folder.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Folder deleted successfully",
        })
        onRefresh()
      } else {
        const error = await res.json()
        throw new Error(error.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete folder",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer" onDoubleClick={onOpen}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsRenaming(true)} disabled={(folder.item_count || 0) > 0}>
                <Edit2 className="w-4 h-4 mr-2" />
                Rename {(folder.item_count || 0) > 0 && "(Only empty folders)"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col items-center text-center">
          <Folder className="w-8 h-8 text-blue-500 mb-2" />
          {isRenaming ? (
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename()
                if (e.key === "Escape") setIsRenaming(false)
              }}
              className="text-xs h-6 text-center"
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-xs mb-1 line-clamp-2 leading-tight">{folder.name}</h3>
          )}
          <p className="text-xs text-muted-foreground">{folder.item_count || 0} items</p>
        </div>
      </CardContent>
    </Card>
  )
}

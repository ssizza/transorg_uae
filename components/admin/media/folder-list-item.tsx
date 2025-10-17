"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Folder, MoreVertical, Edit2, Trash2 } from "lucide-react"
import type { MediaFolder } from "./media-management"

interface FolderListItemProps {
  folder: MediaFolder
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
  onRefresh: () => void
}

export function FolderListItem({ folder, isSelected, onSelect, onOpen, onRefresh }: FolderListItemProps) {
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

  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg group" onDoubleClick={onOpen}>
      <div className="col-span-1">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </div>
      <div className="col-span-4 flex items-center gap-3">
        <Folder className="w-5 h-5 text-blue-500" />
        {isRenaming ? (
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename()
              if (e.key === "Escape") setIsRenaming(false)
            }}
            className="h-8"
            autoFocus
          />
        ) : (
          <span className="font-medium cursor-pointer">{folder.name}</span>
        )}
      </div>
      <div className="col-span-2 flex items-center text-sm text-muted-foreground">Folder</div>
      <div className="col-span-2 flex items-center text-sm text-muted-foreground">-</div>
      <div className="col-span-2 flex items-center text-sm text-muted-foreground">
        {new Date(folder.created_at).toLocaleDateString()}
      </div>
      <div className="col-span-1 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenaming(true)} disabled={(folder.item_count || 0) > 0}>
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

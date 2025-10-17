"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFolderId: number | null
  onSuccess: () => void
}

export function CreateFolderDialog({ open, onOpenChange, currentFolderId, onSuccess }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCreate = async () => {
    if (!folderName.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/admin/media/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderName.trim(),
          parentId: currentFolderId,
        }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Folder created successfully",
        })
        setFolderName("")
        onOpenChange(false)
        onSuccess()
      } else {
        const error = await res.json()
        throw new Error(error.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create folder",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate()
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!folderName.trim() || loading}>
              Create Folder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

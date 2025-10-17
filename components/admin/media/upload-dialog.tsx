"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2 } from "lucide-react"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFolderId: number | null
  onSuccess: () => void
}

export function UploadDialog({ open, onOpenChange, currentFolderId, onSuccess }: UploadDialogProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (uploadFiles: FileList) => {
    if (!uploadFiles || uploadFiles.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()

      Array.from(uploadFiles).forEach((file) => {
        formData.append("files", file)
      })

      if (currentFolderId) {
        formData.append("folderId", currentFolderId.toString())
      }

      const res = await fetch("/api/admin/media/files", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        toast.success("Success", {
          description: data.message,
        })
        onOpenChange(false)
        onSuccess()
      } else {
        const error = await res.json()
        throw new Error(error.error)
      }
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to upload files",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                <p className="text-lg font-medium mb-2">Uploading files...</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports: JPG, PNG, GIF, MP4, MOV, AVI (Max 100MB per file)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

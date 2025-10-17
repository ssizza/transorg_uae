"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useMediaPicker } from "./use-media-picker"
import { ImageIcon, Video, Plus } from "lucide-react"
import type { MediaFile } from "../media-management"

interface MediaPickerButtonProps {
  onSelect: (file: MediaFile) => void
  fileType?: "image" | "video" | "all"
  title?: string
  multiple?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  children?: React.ReactNode
}

export function MediaPickerButton({
  onSelect,
  fileType = "all",
  title,
  multiple = false,
  variant = "outline",
  size = "default",
  children,
}: MediaPickerButtonProps) {
  const { openPicker, MediaPicker } = useMediaPicker({
    fileType,
    title: title || `Select ${fileType === "all" ? "Media" : fileType}`,
    multiple,
  })

  const handleClick = () => {
    openPicker(onSelect)
  }

  const getIcon = () => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="w-4 h-4 mr-2" />
      case "video":
        return <Video className="w-4 h-4 mr-2" />
      default:
        return <Plus className="w-4 h-4 mr-2" />
    }
  }

  const getDefaultText = () => {
    switch (fileType) {
      case "image":
        return "Add Image"
      case "video":
        return "Add Video"
      default:
        return "Add Media"
    }
  }

  return (
    <>
      <Button variant={variant} size={size} onClick={handleClick}>
        {getIcon()}
        {children || getDefaultText()}
      </Button>
      <MediaPicker />
    </>
  )
}

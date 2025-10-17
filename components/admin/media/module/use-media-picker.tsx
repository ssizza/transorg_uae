"use client"

import { useState } from "react"
import { MediaPickerModal } from "./media-picker-modal"
import type { MediaFile } from "../media-management"

interface UseMediaPickerOptions {
  fileType?: "image" | "video" | "all"
  title?: string
  multiple?: boolean
}

export function useMediaPicker(options: UseMediaPickerOptions = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [onSelectCallback, setOnSelectCallback] = useState<((file: MediaFile) => void) | null>(null)

  const openPicker = (onSelect: (file: MediaFile) => void) => {
    setOnSelectCallback(() => onSelect)
    setIsOpen(true)
  }

  const closePicker = () => {
    setIsOpen(false)
    setOnSelectCallback(null)
  }

  const handleSelect = (file: MediaFile) => {
    if (onSelectCallback) {
      onSelectCallback(file)
    }
    closePicker()
  }

  const MediaPicker = () => (
    <MediaPickerModal
      open={isOpen}
      onOpenChange={setIsOpen}
      onSelect={handleSelect}
      fileType={options.fileType}
      title={options.title}
      multiple={options.multiple}
    />
  )

  return {
    openPicker,
    closePicker,
    MediaPicker,
    isOpen,
  }
}

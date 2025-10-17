"use client"

import { useState } from "react"
import Image from "next/image"
import { MediaPickerButton } from "./media-picker-button"
import { useMediaPicker } from "./use-media-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video } from "lucide-react"
import type { MediaFile } from "../media-management"

export function MediaPickerTest() {
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<MediaFile | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([])

  // Using the hook directly
  const { openPicker: openImagePicker, MediaPicker: ImagePicker } = useMediaPicker({
    fileType: "image",
    title: "Select Blog Image",
  })

  const handleImageSelect = (file: MediaFile) => {
    setSelectedImage(file)
    console.log("Selected image:", file.file_url)
  }

  const handleVideoSelect = (file: MediaFile) => {
    setSelectedVideo(file)
    console.log("Selected video:", file.file_url)
  }

  const handleMultipleSelect = (file: MediaFile) => {
    setSelectedMedia((prev) => [...prev, file])
    console.log("Selected media:", file.file_url)
  }

  const handleCustomImagePicker = () => {
    openImagePicker((file) => {
      setSelectedImage(file)
      console.log("Custom picker - Selected image:", file.file_url)
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Image Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Image Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MediaPickerButton fileType="image" onSelect={handleImageSelect} title="Select Blog Image" />

            {selectedImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Image:</p>
                <div className="relative w-full h-32 rounded border overflow-hidden">
                  <Image
                    src={selectedImage.file_url || "/placeholder.svg"}
                    alt={selectedImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{selectedImage.title}</p>
                <p className="text-xs text-muted-foreground">URL: {selectedImage.file_url}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Video Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MediaPickerButton fileType="video" onSelect={handleVideoSelect} title="Select Video" />

            {selectedVideo && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Video:</p>
                <div className="w-full h-32 bg-muted rounded border flex items-center justify-center">
                  <Video className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{selectedVideo.title}</p>
                <p className="text-xs text-muted-foreground">URL: {selectedVideo.file_url}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Hook Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Hook Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleCustomImagePicker}>Open Custom Image Picker</Button>

            {selectedImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected via Hook:</p>
                <div className="relative w-full h-32 rounded border overflow-hidden">
                  <Image
                    src={selectedImage.file_url || "/placeholder.svg"}
                    alt={selectedImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Multiple Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Multiple Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MediaPickerButton
              fileType="all"
              onSelect={handleMultipleSelect}
              title="Select Multiple Media"
              multiple={true}
            >
              Add Multiple Files
            </MediaPickerButton>

            {selectedMedia.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Media ({selectedMedia.length}):</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMedia.map((file, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      {file.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Render the custom picker */}
      <ImagePicker />
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { FiUpload, FiX } from "react-icons/fi"
import { Card } from "@/components/ui/card"

interface ImageUploadSectionProps {
  images: File[]
  onImagesChange: (images: File[]) => void
}

export default function ImageUploadSection({ images, onImagesChange }: ImageUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      onImagesChange([...images, ...files].slice(0, 5))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      onImagesChange([...images, ...files].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <Card className="p-6">
      <h2 className="mb-2 text-lg font-semibold text-foreground">Product Images</h2>
      <p className="mb-4 text-sm text-muted-foreground">Upload up to 5 images of your product</p>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? "border-foreground bg-muted" : "border-border bg-muted/30 hover:border-foreground"
        }`}
      >
        <FiUpload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="mb-2 font-medium text-foreground">Drag and drop your images here</p>
        <p className="mb-4 text-sm text-muted-foreground">or</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-foreground/90 transition-colors"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-foreground">Selected Images ({images.length}/5)</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {images.map((file, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg bg-muted">
                <div className="relative aspect-square">
                  <Image
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

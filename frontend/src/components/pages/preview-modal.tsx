"use client"

import Image from "next/image"
import { FiX } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FormData {
  productName: string
  price: string
  originalPrice: string
  category: string
  condition: string
  school: string
  hostel: string
  pickupLocation: string
  sellerName: string
  whatsappNumber: string
  durationOfUse: string
  description: string
  negotiable: boolean
  images: File[]
  specs: Array<{ label: string; value: string }>
  features: string[]
  safetyTips: string[]
}

interface PreviewModalProps {
  data: FormData
  onClose: () => void
}

export default function PreviewModal({ data, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-4">
          <h2 className="text-lg font-semibold text-foreground">Product Preview</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Images */}
          {data.images.length > 0 && (
            <div>
              <div className="relative mb-4 aspect-square w-full bg-muted rounded-lg overflow-hidden">
                <Image
                  src={URL.createObjectURL(data.images[0]) || "/placeholder.svg"}
                  alt={data.productName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Title & Price */}
          <div>
            <h1 className="mb-3 text-2xl font-bold text-foreground">{data.productName || "Product Name"}</h1>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">${data.price || "0"}</span>
              {data.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${data.originalPrice}</span>
              )}
              {data.negotiable && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">Negotiable</span>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-3 border-b border-border pb-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">School</span>
              <span className="font-semibold text-foreground">{data.school || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Hostel</span>
              <span className="font-semibold text-foreground">{data.hostel || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Condition</span>
              <span className="font-semibold text-foreground">{data.condition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration of Use</span>
              <span className="font-semibold text-foreground">{data.durationOfUse || "N/A"}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 font-semibold text-foreground">About this item</h3>
            <p className="text-sm text-foreground leading-relaxed">{data.description || "No description provided"}</p>
          </div>

          {/* Specs */}
          {data.specs.some((s) => s.label && s.value) && (
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Specifications</h3>
              <div className="space-y-2 border-b border-border pb-4">
                {data.specs
                  .filter((s) => s.label && s.value)
                  .map((spec, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Features */}
          {data.features.some((f) => f) && (
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Key Features</h3>
              <ul className="mb-4 space-y-2 border-b border-border pb-4">
                {data.features
                  .filter((f) => f)
                  .map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0"></span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Seller Info */}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-3 font-semibold text-foreground">Seller Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-foreground">
                <span className="text-muted-foreground">Name: </span>
                {data.sellerName || "N/A"}
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">WhatsApp: </span>
                {data.whatsappNumber || "N/A"}
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Pickup Location: </span>
                {data.pickupLocation || "N/A"}
              </p>
            </div>
          </div>

          {/* Safety Tips */}
          {data.safetyTips.some((t) => t) && (
            <div>
              <h3 className="mb-3 font-semibold text-foreground">Safety Tips</h3>
              <ul className="space-y-2">
                {data.safetyTips
                  .filter((t) => t)
                  .map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-destructive">⚠</span>
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Close Button */}
          <div className="border-t border-border pt-4">
            <Button onClick={onClose} className="w-full bg-foreground text-primary-foreground">
              Close Preview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

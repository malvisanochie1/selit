"use client"

import { FiMessageCircle, FiPhone, FiMapPin } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Product {
  price: number
  sellerName: string
  sellerYears: string
  sellerBadge: string
  sellerResponseTime: string
  whatsappNumber: string
  pickupLocation: string
}

export default function SellerInfo({ product }: { product: Product }) {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in your listing.")
    window.open(`https://wa.me/${product.whatsappNumber.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  return (
    <Card className="p-6">
      {/* Price */}
      <div className="mb-6 border-b border-border pb-6">
        <p className="text-4xl font-bold text-foreground">₦{product.price.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-2 line-through">₦{product.price.toLocaleString()}</p>
      </div>

      {/* Seller Info Card */}
      <Card className="mb-6 p-4 bg-secondary border-0">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-base">
            {product.sellerBadge}
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground text-sm">{product.sellerName}</p>
            <p className="text-xs text-muted-foreground mt-1">{product.sellerYears}</p>
            <p className="text-xs text-muted-foreground">{product.sellerResponseTime}</p>
          </div>
        </div>
      </Card>

      {/* WhatsApp CTA Button */}
      <Button
        onClick={handleWhatsAppClick}
        className="w-full mb-3 py-6 bg-green-600 text-white hover:bg-green-700 font-semibold flex items-center justify-center"
      >
        <FiMessageCircle size={20} className="mr-2" />
        Chat on WhatsApp
      </Button>

      {/* Call Button */}
      <Button
        variant="outline"
        className="w-full mb-6 py-6 border-border text-foreground hover:bg-muted font-semibold bg-transparent"
      >
        <FiPhone size={20} className="mr-2" />
        Call Seller
      </Button>

      {/* Pickup Location */}
      <div className="mb-6 p-4 bg-secondary rounded-lg border border-border">
        <div className="flex items-start gap-2">
          <FiMapPin size={18} className="text-foreground mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Pickup Location</p>
            <p className="text-sm text-muted-foreground mt-1">{product.pickupLocation}</p>
          </div>
        </div>
      </div>

      {/* Safety Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-yellow-800 mb-2">⚠ Safety Note</p>
        <p className="text-xs text-yellow-700 leading-relaxed">
          Be cautious of scams. Meet in a public place, verify the item before payment, and use secure payment methods.
        </p>
      </div>
    </Card>
  )
}

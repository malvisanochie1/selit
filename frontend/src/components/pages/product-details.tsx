"use client";

import Image from "next/image";
import { FiShare2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  condition: string;
  school: string;
  hostel: string;
  postedTime: string;
  viewCount: number;
  location: string;
  description: string;
}

export default function ProductDetails({ product }: { product: Product }) {
  const isDataUrl =
    product.image &&
    (product.image.startsWith("data:") || product.image.startsWith("blob:"));

  return (
    <div className="space-y-6">
      {/* Product Image */}
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full bg-muted flex items-center justify-center">
          {isDataUrl ? (
            // Next/Image doesn't support data: or blob: URIs — use a plain img for inline demo images
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover max-h-min"
              priority
            />
          )}
        </div>
      </Card>

      {/* Product Info */}
      <Card className="p-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

          {/* Meta Information */}
          <div className="mt-4 grid gap-3 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">School</span>
              <span className="font-semibold text-foreground">
                {product.school}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Hostel/Location
              </span>
              <span className="font-semibold text-foreground">
                {product.hostel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Condition</span>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                {product.condition}
              </span>
            </div>
          </div>

          {/* Posted Info */}
          <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
            <span>Posted {product.postedTime}</span>
            <span>{product.viewCount} views</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            About this item
          </h2>
          <p className="text-sm text-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Share Button */}
        <div className="mt-6 border-t border-border pt-6">
          <Button
            variant="outline"
            className="w-full py-5 font-semibold bg-transparent border-gray-300 hover:bg-gray-50"
          >
            <FiShare2 size={18} className="mr-2" />
            Share this listing
          </Button>
        </div>
      </Card>
    </div>
  );
}

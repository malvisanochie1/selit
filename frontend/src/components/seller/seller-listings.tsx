"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash2, FiBarChart2, FiEye } from "react-icons/fi";
import { PRODUCTS } from "../../../lib/products-data";
interface ListingProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  postedTime: string;
  viewCount: number;
  sold: number;
}

export function SellerListings() {
  // Mock seller's listings (in real app, filter by seller)
  const listings: ListingProduct[] = PRODUCTS.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    postedTime: p.postedTime,
    viewCount: p.viewCount,
    sold: p.sold,
  }));

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Listings</h2>
        <span className="text-sm text-muted-foreground">
          {listings.length} products
        </span>
      </div>

      <div className="space-y-4">
        {listings.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border-b border-border pb-4 last:border-b-0"
          >
            {/* Image */}
            <div className="relative h-20 w-20 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
              <Image
                src={
                  product.image ||
                  "/placeholder.svg?height=80&width=80&query=product"
                }
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {product.name}
              </h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span>₦{product.price.toLocaleString()}</span>
                <span>•</span>
                <span>{product.category}</span>
                <span>•</span>
                <span>{product.postedTime}</span>
              </div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FiEye size={14} /> {product.viewCount} views
                </span>
                <span>{product.sold} sold</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-transparent"
                title="Edit"
              >
                <FiEdit2 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-transparent"
                title="Analytics"
              >
                <FiBarChart2 size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive bg-transparent"
                title="Delete"
              >
                <FiTrash2 size={16} />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

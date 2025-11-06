"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import Link from "next/link";
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  sold: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-muted">
          {typeof product.image === "string" &&
          (product.image.startsWith("data:") ||
            product.image.startsWith("blob:")) ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              quality={100}
              className="w-full h-full object-cover"
              loading="eager"
            />
          )}
          <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-foreground shadow-md transition-colors hover:bg-white">
            <FiArrowUpRight size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-1 text-sm font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mb-3 text-base font-bold text-foreground">
            ${product.price.toFixed(2)}
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <div className="flex flex-col gap-1">
              <span className="font-medium">Stock: {product.stock}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="font-medium">Sold: {product.sold}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

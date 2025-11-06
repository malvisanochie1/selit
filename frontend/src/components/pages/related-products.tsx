"use client"

import ProductCard from "@/components/product-card"
import { PRODUCTS } from "../../../lib/products-data"
import { useRef } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  const scrollContainer = useRef<HTMLDivElement>(null)

  const currentProduct = PRODUCTS.find((p) => p.id === currentProductId)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === currentProduct?.category && p.id !== currentProductId,
  ).slice(0, 4)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = 300
      scrollContainer.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="mt-20">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Related Products</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-full border border-border p-2 transition-colors hover:bg-muted"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border border-border p-2 transition-colors hover:bg-muted"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainer}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [-webkit-overflow-scrolling:touch]"
      >
        {relatedProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

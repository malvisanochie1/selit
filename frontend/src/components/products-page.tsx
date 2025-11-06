"use client"

import { useState, useMemo } from "react"
import { FiSearch, FiPlus } from "react-icons/fi"
import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { PRODUCTS, CATEGORIES } from "../../lib/products-data"
import Link from "next/link"
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Products")

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold text-foreground">Products</h1>

        {/* Search and Add Button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" size={18} />
            <Input
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-border rounded-lg"
            />
          </div>
          <Link href="/upload" className="gap-2 bg-white text-foreground border border-foreground hover:bg-foreground hover:text-white transition-colors rounded-full md:w-auto w-full px-6 flex items-center py-2">
            <FiPlus size={18} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-foreground text-white"
                : "border border-border bg-white text-foreground hover:border-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-muted">
          <p className="text-center text-muted-foreground">No products found</p>
        </div>
      )}
    </main>
  )
}

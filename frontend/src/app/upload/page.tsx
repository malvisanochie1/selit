"use client"

import Navbar from "@/components/navbar"
import ProductUploadForm from "@/components/pages/product-upload-form"

export default function ProductUploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Upload New Product</h1>
          <p className="mt-2 text-muted-foreground">Fill in the details to list your product on the marketplace</p>
        </div>
        <ProductUploadForm />
      </main>
    </div>
  )
}

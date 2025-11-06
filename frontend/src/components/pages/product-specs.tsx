import { FiCheck } from "react-icons/fi"
import { Card } from "@/components/ui/card"

interface Product {
  specs: Array<{ label: string; value: string }>
  features: string[]
  description: string
}

export default function ProductSpecs({ product }: { product: Product }) {
  return (
    <div className="space-y-8 mt-8">
      {/* Specifications */}
      <Card className="p-6">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Specifications</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {product.specs.map((spec, index) => (
            <div key={index} className="space-y-1 border-b border-border pb-4 last:border-0">
              <p className="text-sm font-medium text-muted-foreground">{spec.label}</p>
              <p className="text-base font-semibold text-foreground">{spec.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Key Features</h2>
        <ul className="space-y-4">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <FiCheck className="mt-1 flex-shrink-0 text-foreground" size={20} />
              <span className="text-base text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Description */}
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-foreground">About This Product</h2>
        <p className="leading-relaxed text-foreground">{product.description}</p>
      </Card>
    </div>
  )
}

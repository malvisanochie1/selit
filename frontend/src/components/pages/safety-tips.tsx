import { FiAlertTriangle } from "react-icons/fi"
import { Card } from "@/components/ui/card"

interface Product {
  safetyTips: string[]
}

export default function SafetyTips({ product }: { product: Product }) {
  return (
    <Card className="p-6 border-red-200 bg-red-50">
      <div className="flex items-center gap-2 mb-4">
        <FiAlertTriangle size={20} className="text-red-600 flex-shrink-0" />
        <h3 className="text-lg font-bold text-red-900">Safety tips</h3>
      </div>

      <ul className="space-y-3">
        {product.safetyTips.map((tip, index) => (
          <li key={index} className="flex gap-3 text-sm text-red-900">
            <span className="flex-shrink-0 font-bold text-red-600">•</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>

      {/* Additional Warning */}
      <div className="mt-6 pt-4 border-t border-red-200">
        <p className="text-xs text-red-800 font-semibold mb-2">Remember:</p>
        <p className="text-xs text-red-800 leading-relaxed">
          Always meet in a public place on campus or designated public location. Never send money in advance. Verify the
          seller&apos;s identity and inspect the item thoroughly before making any payment.
        </p>
      </div>
    </Card>
  )
}

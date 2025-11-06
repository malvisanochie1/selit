"use client"

import { FiPlus, FiX } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FormSection from "@/components/pages/form-section"

interface Spec {
  label: string
  value: string
}

interface DynamicFieldsSectionProps {
  specs: Spec[]
  features: string[]
  safetyTips: string[]
  onSpecsChange: (specs: Spec[]) => void
  onFeaturesChange: (features: string[]) => void
  onSafetyTipsChange: (tips: string[]) => void
}

export default function DynamicFieldsSection({
  specs,
  features,
  safetyTips,
  onSpecsChange,
  onFeaturesChange,
  onSafetyTipsChange,
}: DynamicFieldsSectionProps) {
  const addSpec = () => {
    onSpecsChange([...specs, { label: "", value: "" }])
  }

  const removeSpec = (index: number) => {
    onSpecsChange(specs.filter((_, i) => i !== index))
  }

  const updateSpec = (index: number, field: "label" | "value", value: string) => {
    const updated = [...specs]
    updated[index] = { ...updated[index], [field]: value }
    onSpecsChange(updated)
  }

  const addFeature = () => {
    onFeaturesChange([...features, ""])
  }

  const removeFeature = (index: number) => {
    onFeaturesChange(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, value: string) => {
    const updated = [...features]
    updated[index] = value
    onFeaturesChange(updated)
  }

  const addSafetyTip = () => {
    onSafetyTipsChange([...safetyTips, ""])
  }

  const removeSafetyTip = (index: number) => {
    onSafetyTipsChange(safetyTips.filter((_, i) => i !== index))
  }

  const updateSafetyTip = (index: number, value: string) => {
    const updated = [...safetyTips]
    updated[index] = value
    onSafetyTipsChange(updated)
  }

  return (
    <div className="space-y-6">
      {/* Specifications */}
      <FormSection title="Product Specifications (Optional)" description="Add key specifications about your product">
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Label (e.g., Material)"
                value={spec.label}
                onChange={(e) => updateSpec(index, "label", e.target.value)}
              />
              <Input
                placeholder="Value (e.g., Solid Wood)"
                value={spec.value}
                onChange={(e) => updateSpec(index, "value", e.target.value)}
              />
              {specs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={addSpec}
            variant="outline"
            className="w-full gap-2 border-border bg-transparent"
          >
            <FiPlus size={16} />
            Add Specification
          </Button>
        </div>
      </FormSection>

      {/* Features */}
      <FormSection title="Key Features (Optional)" description="List the main features of your product">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Feature (e.g., Spacious work surface)"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
              />
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={addFeature}
            variant="outline"
            className="w-full gap-2 border-border bg-transparent"
          >
            <FiPlus size={16} />
            Add Feature
          </Button>
        </div>
      </FormSection>

      {/* Safety Tips */}
      <FormSection title="Safety Tips (Optional)" description="Provide safety advice for buyers">
        <div className="space-y-3">
          {safetyTips.map((tip, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Safety tip (e.g., Inspect item before payment)"
                value={tip}
                onChange={(e) => updateSafetyTip(index, e.target.value)}
              />
              {safetyTips.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSafetyTip(index)}
                  className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={addSafetyTip}
            variant="outline"
            className="w-full gap-2 border-border bg-transparent"
          >
            <FiPlus size={16} />
            Add Safety Tip
          </Button>
        </div>
      </FormSection>
    </div>
  )
}

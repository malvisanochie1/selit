import type React from "react"
import { Card } from "@/components/ui/card"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </Card>
  )
}

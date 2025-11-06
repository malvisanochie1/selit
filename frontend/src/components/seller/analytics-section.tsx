"use client"

import { Card } from "@/components/ui/card"
import { FiTrendingUp, FiActivity } from "react-icons/fi"

export function AnalyticsSection() {
  const analyticsData = [
    {
      label: "Best Performing Product",
      value: "iPhone 12 (64GB)",
      metric: "345 views, 12 inquiries",
    },
    {
      label: "Average Response Time",
      value: "47 minutes",
      metric: "Faster than 89% of sellers",
    },
    {
      label: "Conversion Rate",
      value: "4.2%",
      metric: "8 sales from 190 views",
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <FiActivity className="text-muted-foreground" size={20} />
        <h2 className="text-lg font-semibold text-foreground">Analytics Insights</h2>
      </div>

      <div className="space-y-4">
        {analyticsData.map((item, idx) => (
          <div key={idx} className="border-l-2 border-primary pl-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <FiTrendingUp size={12} /> {item.metric}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}

"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import {
  FiTrendingUp,
  FiEye,
  FiMessageCircle,
  FiCheckCircle,
} from "react-icons/fi";

interface StatCard {
  label: string;
  value: number | string;
  change?: string;
  icon: React.ReactNode;
}

export function StatisticsCards() {
  const stats: StatCard[] = [
    {
      label: "Total Listings",
      value: "12",
      change: "+2 this week",
      icon: <FiTrendingUp className="h-5 w-5" />,
    },
    {
      label: "Views",
      value: "2,847",
      change: "+18% from last week",
      icon: <FiEye className="h-5 w-5" />,
    },
    {
      label: "Comments",
      value: "24",
      change: "3 new",
      icon: <FiMessageCircle className="h-5 w-5" />,
    },
    {
      label: "Sold",
      value: "8",
      change: "₦385,000 revenue",
      icon: <FiCheckCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              {stat.change && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {stat.change}
                </p>
              )}
            </div>
            <div className="text-muted-foreground">{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiSettings, FiUser, FiBell, FiLock } from "react-icons/fi"

interface SettingOption {
  icon: React.ReactNode
  label: string
  description: string
}

export function SellerSettings() {
  const settings: SettingOption[] = [
    {
      icon: <FiUser size={18} />,
      label: "Profile",
      description: "Edit your seller profile",
    },
    {
      icon: <FiBell size={18} />,
      label: "Notifications",
      description: "Manage alerts",
    },
    {
      icon: <FiLock size={18} />,
      label: "Privacy",
      description: "Security settings",
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <FiSettings size={20} className="text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
      </div>

      <div className="space-y-2">
        {settings.map((setting, idx) => (
          <button
            key={idx}
            className="w-full flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
          >
            <div className="mt-1 text-muted-foreground">{setting.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 bg-transparent">
        Logout
      </Button>
    </Card>
  )
}

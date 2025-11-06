"use client"

import type React from "react"
import Link from "next/link"
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
  FiGrid,
} from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-white">
              <FiGrid size={18} />
            </div>
            <span className="text-lg font-bold text-foreground">Ecomora</span>
          </div>

          {/* Nav Links */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <NavLink icon={<FiHome size={18} />} label="Dashboard" href="#" />
            <NavLink icon={<FiPackage size={18} />} label="Products" href="#" active />
            <NavLink icon={<FiShoppingCart size={18} />} label="Purchases" href="#" />
            <NavLink icon={<FiUsers size={18} />} label="Customers" href="#" />
            <NavLink icon={<FiBarChart2 size={18} />} label="Analytics" href="#" />
            <NavLink icon={<FiSettings size={18} />} label="Settings" href="#" />
          </div>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <span className="hidden text-sm font-medium sm:inline">Adriane Darwn</span>
                <FiChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

interface NavLinkProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}

function NavLink({ icon, label, href, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        active
          ? "border-b-2 border-foreground text-foreground pb-4"
          : "text-muted-foreground hover:text-foreground pb-4"
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

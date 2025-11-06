"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export function SellerHeader() {
  const sellerName = "Chinedu O.";
  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {greeting}, {sellerName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your listings, monitor performance, and interact with
              buyers
            </p>
          </div>
          <Link href="/upload">
            <Button className="gap-2">
              <FiPlus size={18} />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { SellerHeader } from "@/components/seller/seller-header";
import { StatisticsCards } from "@/components/seller/statistics-cards";
import { SellerListings } from "@/components/seller/seller-listings";
import { ProfileComments } from "@/components/seller/profile-comments";
import { AnalyticsSection } from "@/components/seller/analytics-section";
import { SellerSettings } from "@/components/seller/seller-settings";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Greeting and Stats */}
      <SellerHeader />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        <StatisticsCards />

        {/* Two Column Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Listings and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Listings */}
            <SellerListings />

            {/* Analytics Section */}
            <AnalyticsSection />
          </div>

          {/* Right Column - Comments and Settings */}
          <div className="space-y-8">
            {/* Profile Comments */}
            <ProfileComments />

            {/* Settings */}
            <SellerSettings />
          </div>
        </div>
      </div>
    </div>
  );
}

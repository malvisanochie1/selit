"use client";

import React from "react";
import { NavbarItems } from "../ui/animated-nav-items";
import { navItems, users } from "../texts/constants";
import UserDropdown from "./subSections/UserDropdown";

const Navbar = () => {
  return (
    <section className="border-b w-full">
      <div className="container  px-4 py-2 flex items-center justify-between xl:max-w-6xl mx-auto">
        {/* Logo Section */}
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          <h2>Logo</h2>
        </div>

        {/* Navigation and Actions */}
        <div>
          <div className="flex items-center gap-4">
            {/* Navigation Items */}
            <NavbarItems items={navItems} />

            {/* User Dropdown */}
            <UserDropdown user={users[0]} />

            {/* Sell Button */}
            <button className="bg-brand_gold hover:bg-brand_gold/80 px-6 lg:px-10 py-2 font-semibold rounded-md">
              Sell
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;

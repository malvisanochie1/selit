"use client";
// import Navbar from "@/components/sections/navbar";
import { SidebarDemo } from "@/components/sections/sidebardemo";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { products, users } from "@/components/texts/constants";
import UserDropdown from "@/components/sections/subSections/UserDropdown";

import React, { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 15;

  // Filter products by search (case-insensitive, matches name or description)
  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const totalProductPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );
  const productPageItems = filteredProducts.slice(
    (productPage - 1) * PRODUCTS_PER_PAGE,
    productPage * PRODUCTS_PER_PAGE
  );

  // Reset page to 1 on search change
  React.useEffect(() => {
    setProductPage(1);
  }, [search]);

  return (
    <div className=" dark:bg-slate-950  min-h-screen">
      {/*  <Navbar /> */}
      <div className="p-10 ">
        {/* Selit body */}
        <section className="p-6">
          {/* Top nav/search bar and icons */}
          <div className="flex items-center justify-between mb-8">
            {/* Search bar */}
            <div className="flex items-center w-1/2 dark:bg-slate-900 bg-white rounded-md overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 bg-transparent outline-none placeholder:italic placeholder:text-slate-400"
              />
              <button className="bg-[#2a1766] p-3 flex items-center justify-center">
                <FiSearch size={20} className="text-white" />
              </button>
            </div>
            {/* Icons and avatar */}
            <div className="flex items-center gap-6">
              {/* grid icon */}
              <span className="w-6 h-6 rounded grid place-items-center text-[#2a1766]">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </span>
              {/* bell icon */}
              <span className="w-6 h-6 rounded grid place-items-center text-[#2a1766]">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2v1h16v-1l-2-2z" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </span>
              {/* more icon */}
              <span className="w-6 h-6 rounded grid place-items-center text-[#2a1766]">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19.5" cy="12" r="1.5" />
                  <circle cx="4.5" cy="12" r="1.5" />
                </svg>
              </span>
              {/* avatar */}

              <UserDropdown user={users[0]} />
            </div>
          </div>

          {/* Product Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productPageItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="dark:bg-slate-900 bg-white rounded-xl shadow p-4 flex flex-col items-center hover:scale-[1.03] transition-transform duration-150 cursor-pointer"
                  prefetch={false}
                >
                  <div className="rounded overflow-hidden w-full h-36 mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={220}
                      height={220}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="text-center w-full">
                    <div className="font-medium mb-1">{item.name}</div>
                    <div className="flex justify-center mb-1">
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <div className="dark:text-[#593cbb] text-[#2a1766] font-semibold mb-2">
                      ₦{item.price.toLocaleString()}
                    </div>
                    <span className="bg-[#2a1766] text-white text-xs px-4 py-1 rounded inline-block mt-1">
                      View Details
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalProductPages }, (_, i) => i + 1).map(
                (n) => (
                  <button
                    key={n}
                    onClick={() => setProductPage(n)}
                    className={`w-8 h-8 rounded border border-gray-300 bg-white text-[#2a1766] font-medium hover:bg-[#2a1766] hover:text-white transition ${
                      productPage === n
                        ? "dark:bg-[#181033] bg-[#2a1766] text-white"
                        : ""
                    }`}
                    disabled={productPage === n}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                className="w-12 h-8 rounded bg-[#2a1766] text-white font-medium ml-2 disabled:opacity-50"
                onClick={() =>
                  setProductPage((prev) =>
                    Math.min(prev + 1, totalProductPages)
                  )
                }
                disabled={
                  productPage === totalProductPages || totalProductPages === 0
                }
              >
                Next
              </button>
            </div>
          </div>
        </section>
        <SidebarDemo />
      </div>
    </div>
  );
}

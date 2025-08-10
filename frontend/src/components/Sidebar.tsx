"use client";
import React, { useState } from "react";
// import { FiSearch } from "react-icons/fi";
// import {
//   MdOutlineDashboard,
//   MdOutlineShoppingBag,
//   MdOutlineAttachMoney,
// } from "react-icons/md";
// import { IoHome } from "react-icons/io5";
// import { TiHomeOutline } from "react-icons/ti";

// import { MdFavoriteBorder } from "react-icons/md";
import ThemeToggle from "./toggle";
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks, selit } from "./texts/constants";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  return (
    <aside
      className={`group fixed left-0 top-0 z-40 flex flex-col h-screen rounded-r-2xl bg-gradient-to-br from-[#14064E]  to-[#330D5C] text-white shadow-lg transition-all duration-300 overflow-hidden
        dark:from-[#18122b] dark:to-[#180f38] dark:text-neutral-200
        ${expanded ? "w-80 ps-20 p-8" : " w-20 p-4"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="pt-14 h-full flex flex-col justify-between">
        <div>
          <div>
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 mb-10 rounded-md transition-colors duration-200
               
                ${!expanded ? "justify-center" : ""}
              `}
            >
              <Image src={selit.logo} width={35} height={35} alt="Selit logo" />{" "}
              {expanded && (
                <span
                  className="text-2xl transition-all duration-200 font-extrabold tracking-wides"
                  style={{
                    fontFamily: "'Anton', Arial, sans-serif",
                    letterSpacing: "0.15em",
                  }}
                >
                  SELIT
                </span>
              )}
            </Link>
          </div>
          <div>
            <nav className="flex flex-col gap-2">
              {sidebarLinks.map((item) => (
                <Link
                  key={item.label}
                  href="#"
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200
                hover:bg-white hover:text-[#2a1766] hover:font-semibold
                dark:hover:bg-[#2a1766] dark:hover:text-white
                ${!expanded ? "justify-center" : ""}
                font-anton
              `}
                  style={{
                    fontFamily: "'Anton', Arial, sans-serif",
                  }}
                >
                  {item.icon}
                  {expanded && (
                    <span
                      className="text-sm ml-2 transition-all duration-200 font-anton"
                      style={{
                        fontFamily: "'Anton', Arial, sans-serif",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <section>
          <ThemeToggle />
        </section>
      </div>
      <div
        className={`dark:bg-[#200b31a4] bg-[#1F1458] -z-50 absolute -top-14 -left-14 rounded-full transition-all duration-300 w-80 h-80 opacity-100`}
      />
      <div
        className={`dark:bg-[#200b3191] bg-[#44196885] -z-50 absolute -bottom-32 -left-24 rounded-full transition-all duration-300 w-96 h-96 opacity-100`}
      />
      <div
        className={`dark:bg-[#200b31b7] bg-[#330d5cd8] -z-50 absolute -bottom-40 -left-28 rounded-full transition-all duration-300 w-96 h-96 opacity-100`}
      />
    </aside>
  );
}

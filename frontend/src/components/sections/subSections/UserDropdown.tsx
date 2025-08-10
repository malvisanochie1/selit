// components/UserDropdown.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { IoGrid } from "react-icons/io5";
import { RiSpeakAiFill } from "react-icons/ri";
import { MdOutlineBarChart } from "react-icons/md";
import { users } from "@/components/texts/constants";
import Link from "next/link";
import Image from "next/image";
interface User {
  name: string;
  role: string;
  profilePicture: string;
}

export default function UserDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-2 focus:outline-none"
        type="button"
        tabIndex={0}
      >
        <Image
          src={users[0].profilePicture}
          className="w-10 h-10 rounded-full border border-white object-cover"
          alt="User avatar"
          width={40}
          height={40}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">
                {user.role === "seller" ? "Verified Seller" : "Buyer"}
              </p>
            </div>

            <div className="flex flex-col text-gray-700 text-sm">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <IoGrid size={18} />
                My Shop
              </Link>
              <Link
                href="/feedback"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <RiSpeakAiFill size={18} />
                Feedback
              </Link>
              <Link
                href="/performance"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <MdOutlineBarChart size={18} />
                Performance
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <FiSettings size={18} />
                Settings
              </Link>
            </div>

            <div className="border-t">
              <button
                onClick={() => alert("Logging out...")}
                className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
              >
                <FiLogOut size={18} />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

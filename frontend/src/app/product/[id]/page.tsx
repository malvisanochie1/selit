"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const product = {
  id: 1,
  name: "Commercial 12liters Professional Electric Countertop Deep",
  description:
    "Quality Commercial 12liters professional electric countertop deep fryer single tank stainless steel",
  price: 145000,
  images: [
    "/sc.png", // main image
    "/sc2.png", // secondary image (replace with actual path)
  ],
  condition: "Brand New",
  type: "Other",
  location: "Delta, Warri",
  posted: "2 hours ago",
  views: 21,
  seller: {
    name: "Doris Empire",
    verified: true,
    repliesFast: true,
    memberSince: "1 yr, 8 m",
    avatar: "/avatar.png", // replace with actual path
  },
};

export default function ProductPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <div className="bg-[#f4fafd] min-h-screen py-6 px-2 flex justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-6">
        {/* Left: Images + Info */}
        <div className="flex-1">
          {/* Main Image Preview */}
          <div
            className="bg-white rounded-xl p-4 mb-3 shadow cursor-pointer"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={400}
              className="rounded-xl w-full h-72 object-contain"
              priority
            />
            <div className="absolute mt-2 ml-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <span className="material-icons text-base">photo_library</span>
              <span>
                {lightboxIndex + 1}/{product.images.length}
              </span>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mb-4">
            {product.images.map((img, idx) => (
              <div
                key={img}
                className={`border-2 rounded-lg cursor-pointer ${
                  idx === lightboxIndex
                    ? "border-[#2a1766]"
                    : "border-transparent"
                }`}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={img}
                  alt={`thumb-${idx}`}
                  width={90}
                  height={70}
                  className="rounded-lg object-contain w-24 h-16"
                />
              </div>
            ))}
          </div>
          {/* Product Title */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h1 className="text-xl font-semibold mb-2">{product.name}</h1>
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <span>{product.location}</span>
              <span className="mx-2">•</span>
              <span>{product.posted}</span>
              <span className="mx-2">•</span>
              <span>{product.views} views</span>
            </div>
            <div className="flex gap-6 mb-2 text-sm">
              <div>
                <span className="text-gray-500">Type</span>
                <div>{product.type}</div>
              </div>
              <div>
                <span className="text-gray-500">Condition</span>
                <div>{product.condition}</div>
              </div>
            </div>
            <div className="mb-4">{product.description}</div>
            <button className="bg-[#2a1766]hover:bg-green-700 text-white px-6 py-2 rounded font-semibold mb-2 w-full">
              Show contact
            </button>
            <button className="bg-[#2a1766] text-gray-200 px-6 py-2 rounded font-semibold w-full mb-2">
              Start chat
            </button>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-100 text-blue-700 px-4 py-1 rounded text-xs">
                <span className="material-icons align-middle text-base">
                  share
                </span>{" "}
                Share
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-1 rounded text-xs">
                <span className="material-icons align-middle text-base">
                  bookmark
                </span>{" "}
                Save
              </button>
            </div>
            <button className="bg-[#2a1766] text-white px-6 py-2 rounded font-semibold mt-4 w-full">
              Make an offer
            </button>
          </div>
        </div>
        {/* Right: Seller & Actions */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="text-2xl font-bold text-[#2a1766] mb-2">
              ₦ {product.price.toLocaleString()}
            </div>
            <button className="mt-4 hover:bg-[#2a1766] border-2 border-[#44196885] text-[#342072] hover:text-white w-full py-2 rounded font-semibold mb-2">
              Request call back
            </button>
            {/* Seller Info */}
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={product.seller.avatar}
                alt={product.seller.name}
                width={40}
                height={40}
                className="rounded-full border"
              />
              <div>
                <div className="font-medium">{product.seller.name}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  {product.seller.verified && (
                    <span className="material-icons text-base">verified</span>
                  )}
                  Verified ID
                </div>
                <div className="text-xs text-gray-500">
                  Replies quickly within minutes
                </div>
                <div className="text-xs text-gray-500">
                  {product.seller.memberSince}
                </div>
              </div>
            </div>
            <button className="bg-[purple-100] text-green-700 w-full py-2 rounded font-semibold mb-2">
              Show contact
            </button>
            <button className="bg-green-100 text-green-700 w-full py-2 rounded font-semibold mb-2">
              Start chat
            </button>
            <div className="flex gap-2 mb-2">
              <button className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                Mark unavailable
              </button>
              <button className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                Report Abuse
              </button>
            </div>
            {/* Feedback */}
            <div className="text-xs text-gray-600 mb-2">
              <span className="font-semibold text-orange-600">32 Feedback</span>
              <span className="ml-2 underline cursor-pointer">view all</span>
            </div>
            {/* Safety Tips */}
            <div className="bg-gray-50 rounded p-2 text-xs text-gray-700 mb-2">
              <div className="font-semibold mb-1">Safety tips</div>
              <ul className="list-disc ml-4">
                <li>Avoid paying in advance, even for delivery</li>
                <li>Meet with the seller at a safe public place</li>
                <li>Inspect the item and ensure it’s exactly what you want</li>
                <li>
                  Make sure that the packed item is the one you’ve inspected
                </li>
                <li>Only pay if you’re satisfied</li>
              </ul>
            </div>
            <button className="bg-green-100 text-green-700 w-full py-2 rounded font-semibold">
              Post Ad Like This
            </button>
          </div>
        </div>
      </div>
      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={product.images.map((src) => ({ src }))}
        index={lightboxIndex}
        plugins={[Fullscreen, Zoom]}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />
    </div>
  );
}

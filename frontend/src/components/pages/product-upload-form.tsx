"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { FiUpload, FiEye } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "../../../lib/products-data";
import ImageUploadSection from "@/components/pages/image-upload-section";
import FormSection from "@/components/pages/form-section";
import DynamicFieldsSection from "@/components/pages/dynamic-fields-section";
import PreviewModal from "@/components/pages/preview-modal";
import { saveProduct } from "../../../lib/save-product";

interface FormData {
  productName: string;
  price: string;
  originalPrice: string;
  category: string;
  condition: string;
  school: string;
  hostel: string;
  pickupLocation: string;
  sellerName: string;
  whatsappNumber: string;
  durationOfUse: string;
  description: string;
  negotiable: boolean;
  images: File[];
  specs: Array<{ label: string; value: string }>;
  features: string[];
  safetyTips: string[];
}

const CONDITIONS = ["Like New", "Fairly Used", "Used", "Refurbished"];

export default function ProductUploadForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    price: "",
    originalPrice: "",
    category: "Electronics",
    condition: "Fairly Used",
    school: "",
    hostel: "",
    pickupLocation: "",
    sellerName: "",
    whatsappNumber: "",
    durationOfUse: "",
    description: "",
    negotiable: false,
    images: [],
    specs: [{ label: "", value: "" }],
    features: [""],
    safetyTips: [""],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Handle basic text input changes
  const handleInputChange = (
    field: keyof FormData,
    value:
      | string
      | boolean
      | File[]
      | Array<{ label: string; value: string }>
      | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const result = await saveProduct(formData);

      if (result.success) {
        setSuccessMessage(result.message);
        setToast({ message: result.message, type: "success" });
        setFormData({
          productName: "",
          price: "",
          originalPrice: "",
          category: "Electronics",
          condition: "Fairly Used",
          school: "",
          hostel: "",
          pickupLocation: "",
          sellerName: "",
          whatsappNumber: "",
          durationOfUse: "",
          description: "",
          negotiable: false,
          images: [],
          specs: [{ label: "", value: "" }],
          features: [""],
          safetyTips: [""],
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setToast({ message: result.message, type: "error" });
      }
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
      setToast({
        message: "An error occurred while publishing your product.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      {toast && (
        <div
          className={`fixed right-4 top-6 z-50 rounded-md px-4 py-2 text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <ImageUploadSection
          images={formData.images}
          onImagesChange={(images) => handleInputChange("images", images)}
        />

        {/* Basic Product Information */}
        <FormSection
          title="Product Information"
          description="Basic details about your product"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Product Name *
              </label>
              <Input
                placeholder="e.g., Quality Wooden Desk"
                value={formData.productName}
                onChange={(e) =>
                  handleInputChange("productName", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 rounded-md border border-input bg-white px-4 py-2">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.negotiable}
                onChange={(e) =>
                  handleInputChange("negotiable", e.target.checked)
                }
                className="h-4 w-4 rounded border-input cursor-pointer"
              />
              <label
                htmlFor="negotiable"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Price is negotiable
              </label>
            </div>
          </div>
        </FormSection>

        {/* Pricing Information */}
        <FormSection title="Pricing" description="Set your product price">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Selling Price *
              </label>
              <Input
                type="number"
                placeholder="e.g., 45000"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Original Price (optional)
              </label>
              <Input
                type="number"
                placeholder="e.g., 65000"
                value={formData.originalPrice}
                onChange={(e) =>
                  handleInputChange("originalPrice", e.target.value)
                }
              />
            </div>
          </div>
        </FormSection>

        {/* Location Information */}
        <FormSection
          title="Location & Availability"
          description="Where can buyers pick up or meet you"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                School/Institution *
              </label>
              <Input
                placeholder="e.g., University of Lagos"
                value={formData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Hostel/Location *
              </label>
              <Input
                placeholder="e.g., Akoka Hostel"
                value={formData.hostel}
                onChange={(e) => handleInputChange("hostel", e.target.value)}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Pickup Location *
              </label>
              <Input
                placeholder="e.g., Akoka Campus Gate"
                value={formData.pickupLocation}
                onChange={(e) =>
                  handleInputChange("pickupLocation", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Duration of Use *
              </label>
              <Input
                placeholder="e.g., 8 months"
                value={formData.durationOfUse}
                onChange={(e) =>
                  handleInputChange("durationOfUse", e.target.value)
                }
                required
              />
            </div>
          </div>
        </FormSection>

        {/* Seller Information */}
        <FormSection
          title="Your Information"
          description="Contact details for buyers"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Full Name *
              </label>
              <Input
                placeholder="e.g., Chinedu O."
                value={formData.sellerName}
                onChange={(e) =>
                  handleInputChange("sellerName", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                WhatsApp Number *
              </label>
              <Input
                type="tel"
                placeholder="e.g., +234 903 456 7890"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  handleInputChange("whatsappNumber", e.target.value)
                }
                required
              />
            </div>
          </div>
        </FormSection>

        {/* Product Description */}
        <FormSection
          title="Description"
          description="Tell buyers more about your product"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Product Description *
            </label>
            <textarea
              placeholder="Describe the condition, features, why you're selling, etc."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={5}
              className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              required
            />
          </div>
        </FormSection>

        {/* Dynamic Fields */}
        <DynamicFieldsSection
          specs={formData.specs}
          features={formData.features}
          safetyTips={formData.safetyTips}
          onSpecsChange={(specs) => handleInputChange("specs", specs)}
          onFeaturesChange={(features) =>
            handleInputChange("features", features)
          }
          onSafetyTipsChange={(tips) => handleInputChange("safetyTips", tips)}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="gap-2 border-foreground text-foreground hover:bg-muted"
            disabled={isLoading}
          >
            <FiEye size={18} />
            Preview Listing
          </Button>
          <Button
            type="submit"
            className="gap-2 bg-foreground text-primary-foreground hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <FiUpload size={18} />
            {isLoading ? "Publishing..." : "Publish Product"}
          </Button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal data={formData} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}

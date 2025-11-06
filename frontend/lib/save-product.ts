import { PRODUCTS, persistProducts } from "./products-data";

interface ProductFormData {
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

export async function saveProduct(formData: ProductFormData) {
  try {
    const newId = (
      Math.max(...PRODUCTS.map((p) => Number.parseInt(p.id))) + 1
    ).toString();

    // convert first image File to a data URL so we can persist it in localStorage
    const fileToDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") resolve(result);
          else reject(new Error("Failed to read file as data URL"));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

    let imageSrc = "/generic-product-display.png";
    try {
      if (formData.images && formData.images.length > 0) {
        imageSrc = await fileToDataUrl(formData.images[0]);
      }
    } catch (e) {
      console.error("Failed to convert image to data URL:", e);
      imageSrc = "/generic-product-display.png";
    }

    const newProduct = {
      id: newId,
      name: formData.productName,
      price: Number.parseInt(formData.price),
      originalPrice: formData.originalPrice
        ? Number.parseInt(formData.originalPrice)
        : Number.parseInt(formData.price),
      image: imageSrc,
      stock: 1,
      sold: 0,
      category: formData.category,
      rating: 5,
      reviews: 0,
      sku: `STUD-${formData.category
        .slice(0, 3)
        .toUpperCase()}-${newId.padStart(3, "0")}`,
      inStock: true,
      school: formData.school,
      hostel: formData.hostel,
      condition: formData.condition,
      productType: formData.category,
      postedTime: "Just now",
      location: `${formData.school}, ${formData.hostel}`,
      viewCount: 0,
      sellerName: formData.sellerName,
      sellerYears: "Student Seller",
      sellerBadge: formData.sellerName.charAt(0).toUpperCase(),
      sellerResponseTime: "Typically replies within a few hours",
      whatsappNumber: formData.whatsappNumber,
      durationOfUse: formData.durationOfUse,
      negotiable: formData.negotiable,
      pickupLocation: formData.pickupLocation,
      description: formData.description,
      specs: formData.specs.filter((s) => s.label && s.value),
      features: formData.features.filter((f) => f.trim()),
      safetyTips: formData.safetyTips.filter((t) => t.trim()),
    };

    PRODUCTS.push(newProduct);

    // persist to localStorage for client-side persistence (dev/demo)
    try {
      persistProducts();
    } catch (e) {
      // non-fatal: we still succeed in-memory
      console.error("Failed to persist products:", e);
    }

    return {
      success: true,
      productId: newId,
      message: `Product "${formData.productName}" published successfully!`,
    };
  } catch (error) {
    console.error("[v0] Error saving product:", error);
    return {
      success: false,
      message: "Failed to publish product. Please try again.",
    };
  }
}

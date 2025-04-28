import { ProductCategory } from "@/types";

// تحديد مسارات الصور لكل فئة
const categoryIcons: Record<ProductCategory, string> = {
  distribution_transformers: "/src/assets/categories/transformers.png",
  power_transformers: "/src/assets/categories/transformers.png",
  meters: "/src/assets/categories/meters.png",
  fiber_cables: "/src/assets/categories/fiber.png",
  irons: "/src/assets/categories/irons.png",
};

export default categoryIcons; 
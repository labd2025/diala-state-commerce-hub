import { supabase } from "@/integrations/supabase/client";
import * as productsData from "@/data/products";
import { Product, ProductCategory } from "@/types";

/**
 * تحويل نوع التصنيف إلى معرف التصنيف
 */
const getCategoryId = (category: ProductCategory): string => {
  const categoryMap: Record<ProductCategory, string> = {
    "distribution_transformers": "cat-dist-transformers",
    "power_transformers": "cat-power-transformers",
    "meters": "cat-meters",
    "fiber_cables": "cat-fiber-cables"
  };
  
  return categoryMap[category] || "cat-dist-transformers"; // قيمة افتراضية
};

/**
 * تحويل منتج من واجهة المستخدم إلى صيغة Supabase
 */
const mapProductToSupabaseProduct = (product: Product) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category_id: getCategoryId(product.category),
    images: product.imageUrl ? [product.imageUrl] : [],
    price: product.price || null,
    specifications: {
      ...product.details,
      productType: product.productType,
      capacity: product.capacity,
      voltage: product.voltage,
      current: product.current,
      phase: product.phase,
      fibers: product.fibers,
      isCustomizable: product.isCustomizable,
      subCategory: product.subCategory
    },
    parent_id: product.parent_id || null,
    is_active: true
  };
};

/**
 * ترحيل جميع المنتجات إلى قاعدة البيانات Supabase
 */
const migrateProductsToSupabase = async () => {
  try {
    console.log("Starting migration of mock data to Supabase...");
    
    // الحصول على جميع المنتجات من البيانات التجريبية
    const products = productsData.products;
    console.log(`Found ${products.length} products to migrate`);
    
    // تحويل المنتجات إلى صيغة Supabase
    const supabaseProducts = products.map(mapProductToSupabaseProduct);
    
    // إدراج المنتجات في قاعدة البيانات Supabase
    // استخدام upsert لتحديث المنتجات الموجودة وإضافة الجديدة
    for (let i = 0; i < supabaseProducts.length; i += 100) {
      const batch = supabaseProducts.slice(i, i + 100);
      console.log(`Migrating batch ${i / 100 + 1} (${batch.length} products)`);
      
      const { data, error } = await supabase
        .from("products")
        .upsert(batch, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error migrating batch ${i / 100 + 1}:`, error);
      } else {
        console.log(`Successfully migrated batch ${i / 100 + 1}`);
      }
    }
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

// Execute migration
migrateProductsToSupabase().then(() => {
  console.log("Migration script finished");
}); 
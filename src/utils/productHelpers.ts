import { Product, ProductCategory } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * الحصول على المنتجات الرئيسية (التي ليس لها منتج أب)
 */
export const getRootProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      category_id,
      images,
      price,
      specifications,
      parent_id,
      is_active,
      created_at,
      created_by,
      updated_at,
      stock_quantity
    `)
    .is("parent_id", null)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching root products:", error);
    throw error;
  }

  return (data || []).map(mapSupabaseProductToProduct);
};

/**
 * الحصول على المنتجات الفرعية لمنتج معين
 */
export const getChildProducts = async (parentId: string): Promise<Product[]> => {
  console.log(`Getting child products for parent id: ${parentId}`);
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        category_id,
        images,
        price,
        specifications,
        parent_id,
        is_active,
        created_at,
        created_by,
        updated_at,
        stock_quantity
      `)
      .eq("parent_id", parentId)
      .eq("is_active", true);

    if (error) {
      console.error(`Error fetching child products for parent ${parentId}:`, error);
      
      // البحث في البيانات المحلية
      console.log(`Falling back to mock data for child products of ${parentId}`);
      try {
        const mockProducts = await import("@/data/products").then(m => m.getChildProducts(parentId));
        if (mockProducts && mockProducts.length > 0) {
          console.log(`Found ${mockProducts.length} child products in mock data`);
          return mockProducts;
        }
      } catch (mockError) {
        console.error("Error using mock data:", mockError);
      }
      return [];
    }

    if (data && data.length > 0) {
      console.log(`Found ${data.length} child products in Supabase`);
      return data.map(mapSupabaseProductToProduct);
    } else {
      console.log(`No child products found in Supabase for parent ${parentId}, trying mock data`);
      
      // البحث في البيانات المحلية
      try {
        const mockProducts = await import("@/data/products").then(m => m.getChildProducts(parentId));
        if (mockProducts && mockProducts.length > 0) {
          console.log(`Found ${mockProducts.length} child products in mock data`);
          return mockProducts;
        }
      } catch (mockError) {
        console.error("Error using mock data:", mockError);
      }
      return [];
    }
  } catch (error) {
    console.error(`Exception in getChildProducts for parent ${parentId}:`, error);
    
    // البحث في البيانات المحلية
    console.log(`Falling back to mock data for child products of ${parentId}`);
    try {
      const mockProducts = await import("@/data/products").then(m => m.getChildProducts(parentId));
      if (mockProducts && mockProducts.length > 0) {
        console.log(`Found ${mockProducts.length} child products in mock data`);
        return mockProducts;
      }
    } catch (mockError) {
      console.error("Error using mock data:", mockError);
    }
    return [];
  }
};

/**
 * الحصول على المنتج الأب لمنتج معين
 */
export const getParentProduct = async (productId: string): Promise<Product | null> => {
  // أولاً، احصل على المنتج الحالي للحصول على parent_id
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("parent_id")
    .eq("id", productId)
    .single();

  if (productError || !productData || !productData.parent_id) {
    return null;
  }

  // ثم احصل على بيانات المنتج الأب
  const { data: parentData, error: parentError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      category_id,
      images,
      price,
      specifications,
      parent_id,
      is_active,
      created_at,
      created_by,
      updated_at,
      stock_quantity
    `)
    .eq("id", productData.parent_id)
    .single();

  if (parentError || !parentData) {
    return null;
  }

  return mapSupabaseProductToProduct(parentData);
};

/**
 * الحصول على شجرة المنتجات بدءاً من الجذر وحتى العمق المحدد
 */
export const getProductTree = async (depth: number = 2): Promise<Product[]> => {
  // الحصول على المنتجات الرئيسية
  const rootProducts = await getRootProducts();
  
  if (depth <= 1) return rootProducts;
  
  // إضافة المنتجات الفرعية لكل منتج رئيسي
  const productsWithChildren = await Promise.all(
    rootProducts.map(async (product) => {
      const children = await getChildProducts(product.id);
      return {
        ...product,
        children
      };
    })
  );
  
  return productsWithChildren as unknown as Product[];
};

/**
 * الحصول على المنتجات حسب الفئة
 */
export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  const categoryId = getCategoryId(category);
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      category_id,
      images,
      price,
      specifications,
      parent_id,
      is_active,
      created_at,
      created_by,
      updated_at,
      stock_quantity
    `)
    .eq("category_id", categoryId)
    .eq("is_active", true);

  if (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }

  return (data || []).map(mapSupabaseProductToProduct);
};

/**
 * الحصول على المنتجات القابلة للتخصيص
 */
export const getCustomizableProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      category_id,
      images,
      price,
      specifications,
      parent_id,
      is_active,
      created_at,
      created_by,
      updated_at,
      stock_quantity
    `)
    .eq("is_active", true)
    .containedBy("specifications", { isCustomizable: true });

  if (error) {
    console.error("Error fetching customizable products:", error);
    throw error;
  }

  return (data || []).map(mapSupabaseProductToProduct);
};

/**
 * إضافة منتج جديد
 */
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const { category, ...rest } = product;
  
  // تحويل نوع المنتج إلى الصيغة المناسبة لقاعدة البيانات
  const supabaseProduct = {
    category_id: getCategoryId(category),
    name: rest.name,
    description: rest.description,
    price: rest.price || null,
    specifications: {
      ...rest.details,
      productType: rest.productType,
      capacity: rest.capacity,
      voltage: rest.voltage,
      current: rest.current,
      phase: rest.phase,
      fibers: rest.fibers,
      isCustomizable: rest.isCustomizable
    },
    images: rest.imageUrl ? [rest.imageUrl] : [],
    parent_id: rest.parent_id || null,
    is_active: true
  };
  
  const { data, error } = await supabase
    .from("products")
    .insert(supabaseProduct)
    .select("id")
    .single();
    
  if (error) {
    console.error("Error adding product:", error);
    throw error;
  }
  
  return data?.id;
};

/**
 * تحديث منتج موجود
 */
export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  const updateData: any = {};
  
  if (product.name) updateData.name = product.name;
  if (product.description) updateData.description = product.description;
  if (product.price !== undefined) updateData.price = product.price;
  if (product.imageUrl) updateData.images = [product.imageUrl];
  if (product.parent_id !== undefined) updateData.parent_id = product.parent_id;
  
  // تحديث المواصفات
  if (product.details || product.productType || product.capacity || 
      product.voltage || product.current || product.phase || 
      product.fibers || product.isCustomizable !== undefined) {
    
    // الحصول على المواصفات الحالية أولاً
    const { data: currentProduct, error: fetchError } = await supabase
      .from("products")
      .select("specifications")
      .eq("id", id)
      .single();
      
    if (fetchError) {
      console.error("Error fetching product specifications:", fetchError);
      throw fetchError;
    }
    
    const currentSpecs = currentProduct?.specifications as Record<string, any> || {};
    
    updateData.specifications = {
      ...currentSpecs,
      ...(product.details || {}),
      ...(product.productType ? { productType: product.productType } : {}),
      ...(product.capacity ? { capacity: product.capacity } : {}),
      ...(product.voltage ? { voltage: product.voltage } : {}),
      ...(product.current ? { current: product.current } : {}),
      ...(product.phase ? { phase: product.phase } : {}),
      ...(product.fibers ? { fibers: product.fibers } : {}),
      ...(product.isCustomizable !== undefined ? { isCustomizable: product.isCustomizable } : {})
    };
  }
  
  if (product.category) {
    updateData.category_id = getCategoryId(product.category);
  }
  
  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);
    
  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * حذف منتج
 */
export const deleteProduct = async (id: string): Promise<void> => {
  // يمكن استبدال الحذف الفعلي بتعطيل المنتج
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id);
    
  if (error) {
    console.error("Error deactivating product:", error);
    throw error;
  }
};

/**
 * الحصول على جميع المنتجات النشطة
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      category_id,
      images,
      price,
      specifications,
      parent_id,
      is_active,
      created_at,
      created_by,
      updated_at,
      stock_quantity
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching all products:", error);
    // لا يمكن استخدام بيانات وهمية هنا لأننا نريد جميع المنتجات
    throw error;
  }

  return (data || []).map(mapSupabaseProductToProduct);
};

/**
 * تحويل منتج من صيغة Supabase إلى صيغة واجهة المستخدم
 */
export const mapSupabaseProductToProduct = (
  product: Database["public"]["Tables"]["products"]["Row"]
): Product => {
  const specifications = product.specifications as Record<string, any> || {};
  
  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    category: getCategoryFromId(product.category_id),
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : "",
    price: product.price || undefined,
    details: Object.entries(specifications)
      .filter(([key]) => !['productType', 'capacity', 'voltage', 'current', 'phase', 'fibers', 'isCustomizable'].includes(key))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
    parent_id: product.parent_id || undefined,
    productType: specifications.productType,
    capacity: specifications.capacity,
    voltage: specifications.voltage,
    current: specifications.current,
    phase: specifications.phase,
    fibers: specifications.fibers,
    isCustomizable: specifications.isCustomizable,
    subCategory: specifications.subCategory
  };
};

/**
 * تحويل معرف التصنيف إلى نوع التصنيف
 */
const getCategoryFromId = (categoryId: string): ProductCategory => {
  // هذه الدالة تحتاج إلى تنفيذ منطق تحويل معرف التصنيف من قاعدة البيانات
  // إلى نوع التصنيف المستخدم في واجهة المستخدم
  
  const categoryMap: Record<string, ProductCategory> = {
    "cat-dist-transformers": "distribution_transformers",
    "cat-power-transformers": "power_transformers",
    "cat-meters": "meters",
    "cat-fiber-cables": "fiber_cables"
  };
  
  return categoryMap[categoryId] || "distribution_transformers"; // قيمة افتراضية
};

/**
 * تحويل نوع التصنيف إلى معرف التصنيف
 */
const getCategoryId = (category: ProductCategory): string => {
  const categoryMap: Record<ProductCategory, string> = {
    "distribution_transformers": "cat-dist-transformers",
    "power_transformers": "cat-power-transformers",
    "meters": "cat-meters",
    "fiber_cables": "cat-fiber-cables",
    "irons": "cat-irons"
  };
  
  return categoryMap[category] || "cat-dist-transformers"; // قيمة افتراضية
};

/**
 * الحصول على المنتج بواسطة المعرف
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  console.log(`Attempting to fetch product with id: ${id}`);
  
  try {
    // البحث عن المنتج باستخدام المعرف النصي
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        category_id,
        images,
        price,
        specifications,
        parent_id,
        is_active,
        created_at,
        created_by,
        updated_at,
        stock_quantity
      `)
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      
      // بدلاً من إلقاء الخطأ، ننتقل مباشرة إلى محاولة استخدام البيانات المحلية
      console.log(`Falling back to mock data for id: ${id}`);
      
      // البحث في البيانات المحلية
      try {
        const mockProduct = await import("@/data/products").then(m => m.getProductById(id));
        if (mockProduct) {
          console.log("Found product in mock data:", mockProduct);
          return mockProduct;
        }
      } catch (mockError) {
        console.error("Error using mock data:", mockError);
      }
      return null;
    }

    console.log(`Product data retrieved from Supabase:`, data);
    
    if (data) {
      return mapSupabaseProductToProduct(data);
    } else {
      console.log(`No product found in Supabase, trying mock data for id: ${id}`);
      
      // البحث في البيانات المحلية
      try {
        const mockProduct = await import("@/data/products").then(m => m.getProductById(id));
        if (mockProduct) {
          console.log("Found product in mock data:", mockProduct);
          return mockProduct;
        }
      } catch (mockError) {
        console.error("Error using mock data:", mockError);
      }
      return null;
    }
  } catch (error) {
    console.error(`Exception in getProductById for id ${id}:`, error);
    console.log("Falling back to mock data");
    
    // البحث في البيانات المحلية
    try {
      const mockProduct = await import("@/data/products").then(m => m.getProductById(id));
      if (mockProduct) {
        console.log("Found product in mock data:", mockProduct);
        return mockProduct;
      }
    } catch (mockError) {
      console.error("Error using mock data:", mockError);
    }
    return null;
  }
}; 
import { supabase } from "@/integrations/supabase/client";
import { CustomOrder, OrderStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// إنشاء رقم مرجعي فريد للطلب
const generateReferenceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6); // آخر 6 أرقام من الطابع الزمني
  const random = Math.floor(Math.random() * 9000 + 1000); // رقم عشوائي من 4 أرقام
  return `CO-${timestamp}-${random}`;
};

// إنشاء طلب بمواصفات خاصة
export const createCustomOrder = async (
  customerName: string,
  contactInfo: string,
  description: string,
  baseProductId?: string,
  capacity?: string,
  voltage?: string,
  fibers?: number,
  quantity: number = 1,
  needConsultation: boolean = false
): Promise<{ success: boolean; customOrderId?: string; referenceNumber?: string; error?: string }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    const referenceNumber = generateReferenceNumber();
    
    const { data, error } = await supabase
      .from("custom_orders")
      .insert({
        reference_number: referenceNumber,
        user_id: userId,
        base_product_id: baseProductId,
        customer_name: customerName,
        contact_info: contactInfo,
        description: description,
        capacity: capacity,
        voltage: voltage,
        fibers: fibers,
        quantity: quantity,
        need_consultation: needConsultation,
        status: "pending" as OrderStatus,
      })
      .select("id")
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      customOrderId: data.id,
      referenceNumber: referenceNumber,
    };
  } catch (error) {
    console.error("Error creating custom order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// الحصول على قائمة طلبات المواصفات الخاصة للمستخدم
export const getUserCustomOrders = async (): Promise<{ data: CustomOrder[] | null; error: string | null }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from("custom_orders")
      .select(`
        *,
        base_product:base_product_id (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // تحويل البيانات من صيغة قاعدة البيانات إلى صيغة التطبيق
    const customOrders: CustomOrder[] = data.map(item => ({
      id: item.id,
      referenceNumber: item.reference_number,
      userId: item.user_id,
      baseProductId: item.base_product_id,
      customerName: item.customer_name,
      contactInfo: item.contact_info,
      description: item.description,
      capacity: item.capacity,
      voltage: item.voltage,
      fibers: item.fibers,
      quantity: item.quantity,
      needConsultation: item.need_consultation,
      status: item.status as OrderStatus,
      createdAt: new Date(item.created_at),
      updatedAt: item.updated_at ? new Date(item.updated_at) : undefined,
      baseProduct: item.base_product ? {
        id: item.base_product.id,
        name: item.base_product.name,
        description: item.base_product.description || "",
        category: item.base_product.category_id,
        imageUrl: item.base_product.images?.[0] || "",
        details: item.base_product.specifications || {},
      } : undefined,
    }));
    
    return { data: customOrders, error: null };
  } catch (error) {
    console.error("Error fetching custom orders:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// الحصول على تفاصيل طلب بمواصفات خاصة
export const getCustomOrderDetails = async (customOrderId: string): Promise<{ data: CustomOrder | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("custom_orders")
      .select(`
        *,
        base_product:base_product_id (*)
      `)
      .eq("id", customOrderId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // تحويل البيانات من صيغة قاعدة البيانات إلى صيغة التطبيق
    const customOrder: CustomOrder = {
      id: data.id,
      referenceNumber: data.reference_number,
      userId: data.user_id,
      baseProductId: data.base_product_id,
      customerName: data.customer_name,
      contactInfo: data.contact_info,
      description: data.description,
      capacity: data.capacity,
      voltage: data.voltage,
      fibers: data.fibers,
      quantity: data.quantity,
      needConsultation: data.need_consultation,
      status: data.status as OrderStatus,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      baseProduct: data.base_product ? {
        id: data.base_product.id,
        name: data.base_product.name,
        description: data.base_product.description || "",
        category: data.base_product.category_id,
        imageUrl: data.base_product.images?.[0] || "",
        details: data.base_product.specifications || {},
      } : undefined,
    };
    
    return { data: customOrder, error: null };
  } catch (error) {
    console.error("Error fetching custom order details:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// تحديث حالة طلب بمواصفات خاصة (للإدارة فقط)
export const updateCustomOrderStatus = async (
  customOrderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from("custom_orders")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customOrderId);
    
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating custom order status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}; 
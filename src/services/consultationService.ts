import { supabase } from "@/integrations/supabase/client";
import { Consultation, ConsultationResponse, ConsultationType, OrderStatus } from "@/types";

// إنشاء رقم مرجعي فريد للاستشارة
const generateReferenceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6); // آخر 6 أرقام من الطابع الزمني
  const random = Math.floor(Math.random() * 9000 + 1000); // رقم عشوائي من 4 أرقام
  return `CS-${timestamp}-${random}`;
};

// إنشاء طلب استشارة
export const createConsultation = async (
  customerName: string,
  contactInfo: string,
  description: string,
  consultationType: ConsultationType,
  productId?: string,
): Promise<{ success: boolean; consultationId?: string; referenceNumber?: string; error?: string }> => {
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
      .from("consultations")
      .insert({
        reference_number: referenceNumber,
        user_id: userId,
        product_id: productId,
        customer_name: customerName,
        contact_info: contactInfo,
        description: description,
        consultation_type: consultationType,
        status: "pending" as OrderStatus,
      })
      .select("id")
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      consultationId: data.id,
      referenceNumber: referenceNumber,
    };
  } catch (error) {
    console.error("Error creating consultation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// الحصول على قائمة طلبات الاستشارة للمستخدم
export const getUserConsultations = async (): Promise<{ data: Consultation[] | null; error: string | null }> => {
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
      .from("consultations")
      .select(`
        *,
        product:product_id (*),
        responses:consultation_responses (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // تحويل البيانات من صيغة قاعدة البيانات إلى صيغة التطبيق
    const consultations: Consultation[] = data.map(item => ({
      id: item.id,
      referenceNumber: item.reference_number,
      userId: item.user_id,
      productId: item.product_id,
      customerName: item.customer_name,
      contactInfo: item.contact_info,
      description: item.description,
      consultationType: item.consultation_type as ConsultationType,
      status: item.status as OrderStatus,
      assignedTo: item.assigned_to,
      createdAt: new Date(item.created_at),
      updatedAt: item.updated_at ? new Date(item.updated_at) : undefined,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description || "",
        category: item.product.category_id,
        imageUrl: item.product.images?.[0] || "",
        details: item.product.specifications || {},
      } : undefined,
      responses: item.responses ? item.responses.map((response: any) => ({
        id: response.id,
        consultationId: response.consultation_id,
        responseText: response.response_text,
        createdBy: response.created_by,
        createdAt: new Date(response.created_at),
      })) : [],
    }));
    
    return { data: consultations, error: null };
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// الحصول على تفاصيل طلب استشارة
export const getConsultationDetails = async (consultationId: string): Promise<{ data: Consultation | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("consultations")
      .select(`
        *,
        product:product_id (*),
        responses:consultation_responses (*)
      `)
      .eq("id", consultationId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // تحويل البيانات من صيغة قاعدة البيانات إلى صيغة التطبيق
    const consultation: Consultation = {
      id: data.id,
      referenceNumber: data.reference_number,
      userId: data.user_id,
      productId: data.product_id,
      customerName: data.customer_name,
      contactInfo: data.contact_info,
      description: data.description,
      consultationType: data.consultation_type as ConsultationType,
      status: data.status as OrderStatus,
      assignedTo: data.assigned_to,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      product: data.product ? {
        id: data.product.id,
        name: data.product.name,
        description: data.product.description || "",
        category: data.product.category_id,
        imageUrl: data.product.images?.[0] || "",
        details: data.product.specifications || {},
      } : undefined,
      responses: data.responses ? data.responses.map((response: any) => ({
        id: response.id,
        consultationId: response.consultation_id,
        responseText: response.response_text,
        createdBy: response.created_by,
        createdAt: new Date(response.created_at),
      })) : [],
    };
    
    return { data: consultation, error: null };
  } catch (error) {
    console.error("Error fetching consultation details:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// إضافة رد على طلب استشارة (للإدارة فقط)
export const addConsultationResponse = async (
  consultationId: string,
  responseText: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // التحقق من وجود الاستشارة
    const { data: consultation, error: consultationError } = await supabase
      .from("consultations")
      .select("id")
      .eq("id", consultationId)
      .single();
    
    if (consultationError) {
      throw new Error("Consultation not found");
    }
    
    // إضافة الرد
    const { error } = await supabase
      .from("consultation_responses")
      .insert({
        consultation_id: consultationId,
        response_text: responseText,
        created_by: userId,
      });
    
    if (error) {
      throw error;
    }
    
    // تحديث حالة الاستشارة
    await supabase
      .from("consultations")
      .update({
        status: "processing" as OrderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", consultationId);
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error adding consultation response:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// تحديث حالة طلب استشارة (للإدارة فقط)
export const updateConsultationStatus = async (
  consultationId: string,
  status: OrderStatus
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from("consultations")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", consultationId);
    
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating consultation status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}; 
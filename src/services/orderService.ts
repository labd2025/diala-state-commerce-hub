import { supabase } from '@/integrations/supabase/client';
import { getProductById } from '@/data/products';
import { CartItem } from '@/contexts/CartContext';
import { Order, OrderItem, OrderStatus, OrderStatusHistory } from "@/types";

// إنشاء رقم مرجعي فريد للطلب
const generateOrderReference = (): string => {
  const timestamp = Date.now().toString().slice(-6); // آخر 6 أرقام من الطابع الزمني
  const random = Math.floor(Math.random() * 9000 + 1000); // رقم عشوائي من 4 أرقام
  return `ORD-${timestamp}-${random}`;
};

// إنشاء طلب جديد من عناصر سلة المشتريات
export const createOrder = async (
  shippingAddress: string,
  contactPhone: string,
  paymentMethod: string,
  notes?: string
): Promise<{ success: boolean; orderId?: string; referenceNumber?: string; error?: string }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // الحصول على عناصر سلة المشتريات للمستخدم
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        products (*)
      `)
      .eq("user_id", userId);
    
    if (cartError) {
      throw new Error("Failed to fetch cart items");
    }
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    
    // حساب المجموع الكلي
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.products && typeof item.products === 'object' && 'price' in item.products) {
        const price = item.products.price || 0;
        totalAmount += price * item.quantity;
      }
    }
    
    // إنشاء رقم مرجعي للطلب
    const referenceNumber = generateOrderReference();
    
    // إنشاء الطلب
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_number: referenceNumber,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        phone_number: contactPhone,
        notes: notes,
        status: "pending" as OrderStatus,
      })
      .select("id")
      .single();
    
    if (orderError) {
      throw new Error("Failed to create order");
    }
    
    // إضافة عناصر الطلب
    const orderItems = cartItems.map(item => {
      // التأكد من وجود سعر المنتج
      let price = 0;
      if (item.products && typeof item.products === 'object' && 'price' in item.products) {
        price = item.products.price || 0;
      }
      
      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: price,
      };
    });
    
    // إدخال عناصر الطلب
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    
    if (itemsError) {
      throw new Error("Failed to add order items");
    }
    
    // إضافة أول تحديث لحالة الطلب
    const { error: statusError } = await supabase
      .from("order_status_history")
      .insert({
        order_id: order.id,
        status: "pending",
        notes: "Order created",
        created_by: userId
      });
    
    if (statusError) {
      throw new Error("Failed to add status history");
    }
    
    // مسح سلة المشتريات
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);
    
    if (deleteError) {
      throw new Error("Failed to clear cart");
    }
    
    return {
      success: true,
      orderId: order.id,
      referenceNumber: referenceNumber
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
};

// الحصول على طلبات المستخدم
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // الحصول على الطلبات
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        total_amount,
        status,
        shipping_address,
        phone_number,
        notes,
        created_at,
        updated_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (ordersError) {
      throw new Error("Failed to fetch orders");
    }
    
    if (!orders) {
      return [];
    }
    
    // تحويل من تنسيق Supabase إلى تنسيق التطبيق
    const formattedOrders: Order[] = await Promise.all(orders.map(async (order) => {
      // الحصول على عناصر الطلب
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          id,
          product_id,
          quantity,
          price,
          products (*)
        `)
        .eq("order_id", order.id);
      
      if (itemsError) {
        throw new Error("Failed to fetch order items");
      }
      
      // الحصول على تاريخ حالة الطلب
      const { data: statusHistory, error: statusError } = await supabase
        .from("order_status_history")
        .select(`
          id,
          status,
          notes,
          created_by,
          created_at
        `)
        .eq("order_id", order.id)
        .order("created_at", { ascending: false });
      
      if (statusError) {
        throw new Error("Failed to fetch status history");
      }
      
      // تحويل عناصر الطلب إلى التنسيق المطلوب
      const formattedItems: OrderItem[] = items ? items.map(item => ({
        id: item.id,
        orderId: order.id,
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.price,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          description: item.products.description,
          category: item.products.category_id,
          imageUrl: item.products.images && item.products.images.length > 0 ? item.products.images[0] : '',
          price: item.products.price
        } : undefined
      })) : [];
      
      // تحويل تاريخ حالة الطلب إلى التنسيق المطلوب
      const formattedStatusHistory: OrderStatusHistory[] = statusHistory ? statusHistory.map(status => ({
        id: status.id,
        orderId: order.id,
        status: status.status as OrderStatus,
        notes: status.notes || '',
        createdBy: status.created_by,
        createdAt: new Date(status.created_at)
      })) : [];
      
      return {
        id: order.id,
        referenceNumber: order.order_number,
        userId: userId,
        totalAmount: order.total_amount,
        shippingAddress: order.shipping_address,
        contactPhone: order.phone_number,
        paymentMethod: order.payment_method || 'cash',
        notes: order.notes,
        status: order.status as OrderStatus,
        createdAt: new Date(order.created_at),
        updatedAt: order.updated_at ? new Date(order.updated_at) : undefined,
        items: formattedItems,
        statusHistory: formattedStatusHistory
      };
    }));
    
    return formattedOrders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

// الحصول على تفاصيل طلب محدد
export const getOrderDetails = async (orderId: string): Promise<Order | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // الحصول على الطلب
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        user_id,
        total_amount,
        status,
        shipping_address,
        phone_number,
        payment_method,
        notes,
        created_at,
        updated_at
      `)
      .eq("id", orderId)
      .single();
    
    if (orderError) {
      throw new Error("Failed to fetch order");
    }
    
    if (!order) {
      return null;
    }
    
    // التحقق مما إذا كان المستخدم هو صاحب الطلب أو مسؤول
    if (order.user_id !== userId) {
      const { data: isAdmin } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", userId)
        .single();
      
      if (!isAdmin || !isAdmin.is_admin) {
        throw new Error("Unauthorized");
      }
    }
    
    // الحصول على عناصر الطلب
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        id,
        product_id,
        quantity,
        price,
        products (*)
      `)
      .eq("order_id", order.id);
    
    if (itemsError) {
      throw new Error("Failed to fetch order items");
    }
    
    // الحصول على تاريخ حالة الطلب
    const { data: statusHistory, error: statusError } = await supabase
      .from("order_status_history")
      .select(`
        id,
        status,
        notes,
        created_by,
        created_at
      `)
      .eq("order_id", order.id)
      .order("created_at", { ascending: false });
    
    if (statusError) {
      throw new Error("Failed to fetch status history");
    }
    
    // تحويل عناصر الطلب إلى التنسيق المطلوب
    const formattedItems: OrderItem[] = items ? items.map(item => ({
      id: item.id,
      orderId: order.id,
      productId: item.product_id,
      quantity: item.quantity,
      unitPrice: item.price,
      product: item.products ? {
        id: item.products.id,
        name: item.products.name,
        description: item.products.description,
        category: item.products.category_id,
        imageUrl: item.products.images && item.products.images.length > 0 ? item.products.images[0] : '',
        price: item.products.price
      } : undefined
    })) : [];
    
    // تحويل تاريخ حالة الطلب إلى التنسيق المطلوب
    const formattedStatusHistory: OrderStatusHistory[] = statusHistory ? statusHistory.map(status => ({
      id: status.id,
      orderId: order.id,
      status: status.status as OrderStatus,
      notes: status.notes || '',
      createdBy: status.created_by,
      createdAt: new Date(status.created_at)
    })) : [];
    
    return {
      id: order.id,
      referenceNumber: order.order_number,
      userId: order.user_id,
      totalAmount: order.total_amount,
      shippingAddress: order.shipping_address,
      contactPhone: order.phone_number,
      paymentMethod: order.payment_method || 'cash',
      notes: order.notes,
      status: order.status as OrderStatus,
      createdAt: new Date(order.created_at),
      updatedAt: order.updated_at ? new Date(order.updated_at) : undefined,
      items: formattedItems,
      statusHistory: formattedStatusHistory
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
  notes: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // التحقق مما إذا كان المستخدم مسؤول
    const { data: isAdmin } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", userId)
      .single();
    
    if (!isAdmin || !isAdmin.is_admin) {
      throw new Error("Unauthorized: Only admins can update order status");
    }
    
    // تحديث حالة الطلب
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId);
    
    if (updateError) {
      throw new Error("Failed to update order status");
    }
    
    // إضافة تحديث لتاريخ حالة الطلب
    const { error: historyError } = await supabase
      .from("order_status_history")
      .insert({
        order_id: orderId,
        status: newStatus,
        notes: notes,
        created_by: userId
      });
    
    if (historyError) {
      throw new Error("Failed to add status history");
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred" };
  }
};

// الحصول على تاريخ حالة الطلب
export const getOrderStatusHistory = async (orderId: string): Promise<OrderStatusHistory[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error(userError.message);
    }
    
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // التحقق مما إذا كان المستخدم هو صاحب الطلب أو مسؤول
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("user_id")
      .eq("id", orderId)
      .single();
    
    if (orderError) {
      throw new Error("Failed to fetch order");
    }
    
    if (order.user_id !== userId) {
      const { data: isAdmin } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", userId)
        .single();
      
      if (!isAdmin || !isAdmin.is_admin) {
        throw new Error("Unauthorized");
      }
    }
    
    // الحصول على تاريخ حالة الطلب
    const { data: statusHistory, error: statusError } = await supabase
      .from("order_status_history")
      .select(`
        id,
        status,
        notes,
        created_by,
        created_at
      `)
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    
    if (statusError) {
      throw new Error("Failed to fetch status history");
    }
    
    if (!statusHistory) {
      return [];
    }
    
    // تحويل تاريخ حالة الطلب إلى التنسيق المطلوب
    return statusHistory.map(status => ({
      id: status.id,
      orderId: orderId,
      status: status.status as OrderStatus,
      notes: status.notes || '',
      createdBy: status.created_by,
      createdAt: new Date(status.created_at)
    }));
  } catch (error) {
    console.error("Error fetching order status history:", error);
    return [];
  }
}; 
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Order, OrderStatus, OrderItem, OrderStatusHistory, Product } from "@/types";
import { getProductById } from "./productHelpers"; // Assuming getProductById exists

// Type mapping from Supabase rows to application types
type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type OrderStatusHistoryRow = Database['public']['Tables']['order_status_history']['Row'];

// Helper to map Supabase OrderRow to application Order type
// Note: This assumes related tables (items, history) are fetched separately or joined
const mapOrderRowToOrder = (row: OrderRow): Omit<Order, 'items' | 'statusHistory'> => ({
  id: row.id,
  referenceNumber: row.reference_number,
  userId: row.user_id,
  totalAmount: row.total_amount,
  shippingAddress: row.shipping_address,
  contactPhone: row.contact_phone,
  paymentMethod: row.payment_method,
  notes: row.notes || undefined,
  status: row.status as OrderStatus,
  createdAt: new Date(row.created_at),
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
});

// Helper to map Supabase OrderItemRow to application OrderItem type
// Optionally fetches related product data
const mapOrderItemRowToOrderItem = async (row: OrderItemRow): Promise<OrderItem> => {
  let product: Product | null = null;
  // Fetch product details if needed (optional)
  // product = await getProductById(row.product_id);

  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    // product: product || undefined, // Include product if fetched
  };
};

// Helper to map Supabase OrderStatusHistoryRow to application OrderStatusHistory type
const mapStatusHistoryRowToStatusHistory = (row: OrderStatusHistoryRow): OrderStatusHistory => ({
  id: row.id,
  orderId: row.order_id,
  status: row.status as OrderStatus,
  notes: row.notes || "",
  createdBy: row.created_by, // Assuming this field exists
  createdAt: new Date(row.created_at),
});

/**
 * الحصول على جميع الطلبات (للأدمن)
 */
export const getAllOrders = async (): Promise<Order[]> => {
  console.log("Fetching all orders...");
  try {
    const { data: orderRows, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderError) {
      console.error("Error fetching orders:", orderError);
      throw orderError;
    }

    if (!orderRows) {
      return [];
    }

    console.log(`Fetched ${orderRows.length} orders.`);

    // Map basic order data first
    const orders = orderRows.map(mapOrderRowToOrder);

    // Optionally, fetch related items and history for each order
    // This can be inefficient for many orders, consider fetching on demand
    const detailedOrders = await Promise.all(orders.map(async (order) => {
        const items = await getOrderItems(order.id);
        const history = await getOrderStatusHistory(order.id);
        return { ...order, items, statusHistory: history };
    }));

    return detailedOrders;

  } catch (error) {
    console.error("Exception in getAllOrders:", error);
    throw error;
  }
};

/**
 * الحصول على تفاصيل طلب معين (العناصر والسجل)
 */
export const getOrderDetails = async (orderId: string): Promise<{ items: OrderItem[], history: OrderStatusHistory[] }> => {
    const items = await getOrderItems(orderId);
    const history = await getOrderStatusHistory(orderId);
    return { items, history };
}

/**
 * الحصول على عناصر طلب معين
 */
export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error(`Error fetching items for order ${orderId}:`, error);
    throw error;
  }
  if (!data) return [];

  // Map items (optionally fetch product details concurrently)
  return Promise.all(data.map(mapOrderItemRowToOrderItem));
};

/**
 * الحصول على سجل حالة طلب معين
 */
export const getOrderStatusHistory = async (orderId: string): Promise<OrderStatusHistory[]> => {
  const { data, error } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching status history for order ${orderId}:`, error);
    throw error;
  }
  if (!data) return [];

  return data.map(mapStatusHistoryRowToStatusHistory);
};

/**
 * تحديث حالة طلب معين
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus, adminUserId: string, notes?: string): Promise<void> => {
  console.log(`Updating order ${orderId} status to ${status} by user ${adminUserId}`);
  try {
    // 1. Update the status in the main orders table
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (updateError) {
      console.error(`Error updating order status for ${orderId}:`, updateError);
      throw updateError;
    }

    // 2. Add a record to the status history table
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: status,
        notes: notes || `تم تحديث الحالة إلى '${status}' بواسطة المسؤول.`,
        created_by: adminUserId, // Make sure this column exists and holds the admin user ID
      });

    if (historyError) {
      // Log the error but don't necessarily throw, as the main status was updated
      console.error(`Error adding status history record for order ${orderId}:`, historyError);
      // Optionally: Implement a mechanism to retry adding history later
    }

    console.log(`Successfully updated order ${orderId} status to ${status}`);

  } catch (error) {
    console.error(`Exception in updateOrderStatus for ${orderId}:`, error);
    throw error;
  }
}; 
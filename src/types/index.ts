// انواع البيانات الأساسية في التطبيق

// أنواع التصنيفات
export type ProductCategory = 'distribution_transformers' | 'power_transformers' | 'meters' | 'fiber_cables' | 'irons';

// أدوار المستخدمين في النظام
export type UserRole = 'customer' | 'sales_employee' | 'department_manager' | 'executive' | 'admin';

// مراحل عملية البيع
export type SaleStage = 'inquiry' | 'quotation' | 'negotiation' | 'contract' | 'shipping' | 'completed' | 'canceled';

// أنواع حالة الطلب
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

// أنواع الاستشارات
export type ConsultationType = 'technical' | 'quotation' | 'custom';

// واجهة المنتج
export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  imageUrl?: string;
  price?: number;
  parent_id?: string | null;
  subCategory?: string;
  capacity?: string;
  voltage?: string;
  current?: string;
  phase?: string;
  fibers?: number;
  details: Record<string, any>;
  isCustomizable?: boolean;
  productType?: string;
}

// واجهة عملية البيع
export interface SaleProcess {
  id: string;
  stage: SaleStage;
  customerName: string;
  productIds: string[];
  quantity: number;
  requestDate: Date;
  status: string;
}

// واجهة عنصر سلة التسوق
export interface CartItem {
  productId: string;
  quantity: number;
}

// واجهة المستخدم
export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role: UserRole;
  createdAt: Date;
}

// واجهة الطلب
export interface Order {
  id: string;
  referenceNumber: string;
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  contactPhone: string;
  paymentMethod: string;
  notes?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
}

// واجهة عنصر الطلب
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

// واجهة تاريخ حالة الطلب
export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  notes: string;
  createdBy: string;
  createdAt: Date;
}

// واجهة طلب المواصفات الخاصة (جديد)
export interface CustomOrder {
  id: string;
  referenceNumber: string;
  userId: string;
  baseProductId?: string;
  customerName: string;
  contactInfo: string;
  description: string;
  capacity?: string;
  voltage?: string;
  fibers?: number;
  quantity: number;
  needConsultation: boolean;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
  baseProduct?: Product;
}

// واجهة طلب الاستشارة (جديد)
export interface Consultation {
  id: string;
  referenceNumber: string;
  userId: string;
  productId?: string;
  customerName: string;
  contactInfo: string;
  description: string;
  consultationType: ConsultationType;
  status: OrderStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
  product?: Product;
  responses?: ConsultationResponse[];
}

// واجهة رد الاستشارة (جديد)
export interface ConsultationResponse {
  id: string;
  consultationId: string;
  responseText: string;
  createdBy: string;
  createdAt: Date;
}

// أنواع المقاييس
export type MeterType =
  | "electrical"           // مقاييس كهربائية
  | "electronic"           // مقاييس إلكترونية
  | "smart";               // مقاييس ذكية

// أنواع المحولات الفرعية
export type TransformerType =
  | "11_0416_kv"           // محولات خفض 11/0.416 KV
  | "33_0416_kv"           // محولات خفض 33/0.416 KV
  | "33_115_kv"            // محولات قدرة 33/11.5 KV
  | "132_33_115_kv"        // محولات قدرة متعددة النسب (132, 33, 11.5 KV)
  | "custom";              // مواصفات خاصة

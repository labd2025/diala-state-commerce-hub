import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

// تعريف نوع عنصر السلة
export interface CartItem {
  productId: string;
  quantity: number;
}

// تعريف نوع سياق السلة
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  syncGuestCart: () => Promise<void>;
}

// نوع بيانات عنصر السلة في قاعدة البيانات
type CartItemRow = Database['public']['Tables']['cart_items']['Row'] & { quantity: number };
type CartItemInsert = Database['public']['Tables']['cart_items']['Insert'];

// إنشاء سياق السلة
const CartContext = createContext<CartContextType | undefined>(undefined);

// عدد محاولات إعادة الاتصال
const MAX_RETRIES = 3;
// وقت الانتظار بين كل محاولة (بالميللي ثانية)
const RETRY_DELAY = 1000;

// مزود سياق السلة
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // مخزن مؤقت للسلة لتنفيذ "optimistic updates"
  const cartCache = useRef<{ [userId: string]: CartItem[] }>({});
  
  // عمليات تخزين مؤقت قيد التنفيذ
  const pendingSaveOperations = useRef<{ [key: string]: boolean }>({});

  // تحميل سلة التسوق عند بدء التطبيق أو تغيير المستخدم
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      if (user) {
        // تحميل سلة المستخدم المسجل من قاعدة البيانات
        await loadUserCart(user.id);
      } else {
        // تحميل سلة الضيف من التخزين المحلي
        loadGuestCart();
      }
      setIsLoading(false);
    };

    loadCart();
  }, [user]);

  // حفظ سلة التسوق عند تغييرها
  useEffect(() => {
    if (!isLoading) {
      const saveCart = async () => {
        if (user) {
          // حفظ سلة المستخدم المسجل في قاعدة البيانات
          await saveUserCart(user.id, cartItems);
        } else {
          // حفظ سلة الضيف في التخزين المحلي
          saveGuestCart(cartItems);
        }
      };
      
      // استخدام وقت محدد لتأخير العملية لتجنب الحفظ المتكرر
      const timeoutId = setTimeout(() => {
        saveCart();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [cartItems, user, isLoading]);

  // تحميل سلة المستخدم المسجل من قاعدة البيانات
  const loadUserCart = async (userId: string, retryCount = 0) => {
    try {
      // التحقق من وجود نسخة مخزنة مؤقتاً
      if (cartCache.current[userId]) {
        setCartItems(cartCache.current[userId]);
        
        // تحميل البيانات من قاعدة البيانات في الخلفية
        fetchUserCartFromDb(userId);
        return;
      }
      
      await fetchUserCartFromDb(userId);
    } catch (error) {
      console.error("Error loading user cart:", error);
      
      // إعادة المحاولة عند فشل الاتصال
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          loadUserCart(userId, retryCount + 1);
        }, RETRY_DELAY * (retryCount + 1));
      } else {
        toast({
          title: "خطأ في تحميل السلة",
          description: "لم نتمكن من تحميل سلة التسوق الخاصة بك. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    }
  };
  
  // تحميل بيانات السلة من قاعدة البيانات
  const fetchUserCartFromDb = async (userId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    if (data) {
      const items: CartItem[] = (data as CartItemRow[]).map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      }));
      
      // تحديث المخزن المؤقت
      cartCache.current[userId] = [...items];
      setCartItems(items);

      // دمج سلة الضيف مع سلة المستخدم عند تسجيل الدخول
      await syncGuestCart();
    }
  };

  // تحميل سلة الضيف من التخزين المحلي
  const loadGuestCart = () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(guestCart);
    } catch (error) {
      console.error("Error loading guest cart:", error);
      toast({
        title: "خطأ في تحميل السلة",
        description: "حدث خطأ أثناء تحميل سلة التسوق. سيتم إنشاء سلة جديدة.",
        variant: "destructive",
      });
      setCartItems([]);
    }
  };

  // مزامنة سلة الضيف مع سلة المستخدم
  const syncGuestCart = async () => {
    if (!user) return;
    
    try {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (guestCart.length === 0) return;
      
      // تحميل سلة المستخدم الحالية
      const userCartItems = [...cartItems];
      let hasChanges = false;
      
      // مزامنة عناصر سلة الضيف
      guestCart.forEach((guestItem: CartItem) => {
        const existingItemIndex = userCartItems.findIndex(
          (item) => item.productId === guestItem.productId
        );
        
        if (existingItemIndex >= 0) {
          // إذا كان المنتج موجوداً بالفعل، قم بتحديث الكمية
          userCartItems[existingItemIndex].quantity += guestItem.quantity;
          hasChanges = true;
        } else {
          // إذا لم يكن المنتج موجوداً، أضفه إلى السلة
          userCartItems.push(guestItem);
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        // تحديث المخزن المؤقت وحالة السلة
        cartCache.current[user.id] = [...userCartItems];
        setCartItems(userCartItems);
        
        // حفظ التغييرات في قاعدة البيانات
        await saveUserCart(user.id, userCartItems);
        
        // عرض إشعار نجاح
        toast({
          title: "تم دمج السلة",
          description: "تم دمج عناصر سلة الضيف مع سلة المستخدم بنجاح.",
        });
        
        // مسح سلة الضيف بعد دمجها
        localStorage.removeItem("guestCart");
      }
    } catch (error) {
      console.error("Error syncing guest cart:", error);
      toast({
        title: "خطأ في مزامنة السلة",
        description: "لم نتمكن من دمج سلة الضيف مع سلتك الحالية.",
        variant: "destructive",
      });
    }
  };

  // حفظ سلة المستخدم المسجل في قاعدة البيانات
  const saveUserCart = async (userId: string, items: CartItem[], retryCount = 0) => {
    // تجنب حفظ العمليات المكررة
    const operationKey = `save-${userId}-${Date.now()}`;
    if (pendingSaveOperations.current[operationKey]) return;
    
    pendingSaveOperations.current[operationKey] = true;
    
    try {
      // حذف عناصر السلة الحالية
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        throw deleteError;
      }

      // إضافة العناصر الجديدة
      if (items.length > 0) {
        const cartData: CartItemInsert[] = items.map((item) => ({
          user_id: userId,
          product_id: item.productId,
          quantity: item.quantity,
        }));

        const { error: insertError } = await supabase
          .from('cart_items')
          .insert(cartData);

        if (insertError) {
          throw insertError;
        }
      }
      
      // تحديث المخزن المؤقت
      cartCache.current[userId] = [...items];
    } catch (error) {
      console.error("Error saving user cart:", error);
      
      // إعادة المحاولة عند فشل الاتصال
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          saveUserCart(userId, items, retryCount + 1);
        }, RETRY_DELAY * (retryCount + 1));
      } else {
        toast({
          title: "خطأ في حفظ السلة",
          description: "لم نتمكن من حفظ التغييرات في سلة التسوق الخاصة بك.",
          variant: "destructive",
        });
      }
    } finally {
      // إزالة العملية من قائمة العمليات المعلقة
      delete pendingSaveOperations.current[operationKey];
    }
  };

  // حفظ سلة الضيف في التخزين المحلي
  const saveGuestCart = (items: CartItem[]) => {
    try {
      localStorage.setItem("guestCart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving guest cart:", error);
      toast({
        title: "خطأ في حفظ السلة",
        description: "لم نتمكن من حفظ التغييرات في سلة التسوق الخاصة بك.",
        variant: "destructive",
      });
    }
  };

  // إضافة منتج إلى السلة - مع تحديثات تفاؤلية
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      // تحديث تفاؤلي - تحديث واجهة المستخدم أولاً
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === productId
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // إذا كان المنتج موجوداً بالفعل، قم بتحديث الكمية
          updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // إذا لم يكن المنتج موجوداً، أضفه إلى السلة
          updatedItems = [...prevItems, { productId, quantity }];
        }
        
        // تحديث المخزن المؤقت
        if (user) {
          cartCache.current[user.id] = updatedItems;
        }
        
        return updatedItems;
      });
      
      toast({
        title: "تم إضافة المنتج",
        description: "تمت إضافة المنتج إلى سلة التسوق بنجاح.",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "خطأ في إضافة المنتج",
        description: "لم نتمكن من إضافة المنتج إلى سلة التسوق.",
        variant: "destructive",
      });
    }
  };

  // تحديث كمية منتج في السلة - مع تحديثات تفاؤلية
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      // تحديث تفاؤلي
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        // تحديث المخزن المؤقت
        if (user) {
          cartCache.current[user.id] = updatedItems;
        }
        
        return updatedItems;
      });
      
      toast({
        title: "تم تحديث الكمية",
        description: "تم تحديث كمية المنتج في سلة التسوق بنجاح.",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "خطأ في تحديث الكمية",
        description: "لم نتمكن من تحديث كمية المنتج في سلة التسوق.",
        variant: "destructive",
      });
    }
  };

  // إزالة منتج من السلة - مع تحديثات تفاؤلية
  const removeFromCart = async (productId: string) => {
    try {
      // تحديث تفاؤلي
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.productId !== productId);
        
        // تحديث المخزن المؤقت
        if (user) {
          cartCache.current[user.id] = updatedItems;
        }
        
        return updatedItems;
      });
      
      toast({
        title: "تم إزالة المنتج",
        description: "تمت إزالة المنتج من سلة التسوق بنجاح.",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "خطأ في إزالة المنتج",
        description: "لم نتمكن من إزالة المنتج من سلة التسوق.",
        variant: "destructive",
      });
    }
  };

  // إفراغ السلة - مع تحديثات تفاؤلية
  const clearCart = async () => {
    try {
      // تحديث تفاؤلي
      setCartItems([]);
      
      // تحديث المخزن المؤقت
      if (user) {
        cartCache.current[user.id] = [];
      }
      
      toast({
        title: "تم إفراغ السلة",
        description: "تم إفراغ سلة التسوق بنجاح.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "خطأ في إفراغ السلة",
        description: "لم نتمكن من إفراغ سلة التسوق.",
        variant: "destructive",
      });
    }
  };

  // قيمة السياق
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
    syncGuestCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook لاستخدام سياق السلة
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}; 
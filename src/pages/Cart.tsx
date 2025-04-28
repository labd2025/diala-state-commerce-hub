import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, ClipboardList, LogIn, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCategoryName } from "@/data/products";
import { getProductById } from "@/utils/productHelpers";
import { Product, Order } from "@/types";
import { useToast } from "@/hooks/use-toast";
// @ts-ignore
import { useCart } from "@/contexts/CartContext";
// @ts-ignore
import { useAuth } from "@/contexts/AuthContext";
import { ShippingForm, ShippingData } from "@/components/checkout/ShippingForm";
import { createOrder, getOrderDetails } from "@/services/orderService";
import { OrderStatusPanel } from "@/components/orders/OrderStatusPanel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Define a type for cart item with product data
interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product | null;
}

const Cart = () => {
  const { toast } = useToast();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItemsWithProducts, setCartItemsWithProducts] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [shippingFormOpen, setShippingFormOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  // تحميل بيانات المنتجات
  const loadProductData = useCallback(async () => {
    setIsLoading(true);
    try {
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await getProductById(item.productId);
          return {
            ...item,
            product: product || null
          };
        })
      );
      setCartItemsWithProducts(itemsWithProducts);
      
      // حساب المجموع الفرعي
      const total = itemsWithProducts.reduce((acc, item) => {
        return acc + (item.product?.price || 0) * item.quantity;
      }, 0);
      setSubtotal(total);
    } catch (error) {
      console.error("Error loading product data:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل بيانات المنتجات."
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [cartItems, toast]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  // تحديث بيانات السلة
  const handleRefresh = () => {
    setRefreshing(true);
    loadProductData();
    toast({
      title: "تم التحديث",
      description: "تم تحديث سلة المشتريات",
    });
  };

  // تحميل تفاصيل الطلب الأخير
  useEffect(() => {
    const loadOrderDetails = async () => {
      if (lastOrderId) {
        try {
          const result = await getOrderDetails(lastOrderId);
          // getOrderDetails returns Order | null
          setOrderDetails(result);
        } catch (error) {
          console.error("Error loading order details:", error);
          setOrderDetails(null);
        }
      }
    };

    loadOrderDetails();
  }, [lastOrderId]);

  // فتح نافذة التأكيد
  const openConfirmDialog = () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "لا يمكن إتمام الطلب",
        description: "السلة فارغة. يرجى إضافة منتجات للمتابعة."
      });
      return;
    }

    // التحقق من تسجيل دخول المستخدم
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    setConfirmDialogOpen(true);
  };

  // المتابعة إلى معلومات الشحن
  const continueToShipping = () => {
    setConfirmDialogOpen(false);
    setShippingFormOpen(true);
  };

  // التعامل مع إتمام الطلب
  const handleCheckout = async (shippingData: ShippingData) => {
    setShippingFormOpen(false);
    setOrderSubmitted(true);
    
    // إنشاء الطلب في قاعدة البيانات
    const result = await createOrder(
      shippingData.shippingAddress,
      shippingData.phoneNumber,
      "cash",
      shippingData.notes
    );
    
    if (result.success) {
      setLastOrderId(result.orderId);
      setLastOrderNumber(result.referenceNumber);
      
      toast({
        title: "تم إرسال طلبك",
        description: `تم إنشاء طلبك برقم ${result.referenceNumber}. سنتواصل معك قريباً لتأكيد الطلب.`
      });
      clearCart();
    } else {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: result.error || "لم نتمكن من إتمام طلبك. يرجى المحاولة مرة أخرى."
      });
    }
    
    setOrderSubmitted(false);
  };

  // توجيه المستخدم إلى صفحة تسجيل الدخول
  const redirectToLogin = () => {
    setLoginDialogOpen(false);
    navigate('/auth/login');
  };

  // توجيه المستخدم إلى صفحة التسجيل
  const redirectToRegister = () => {
    setLoginDialogOpen(false);
    navigate('/auth/register');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">سلة التسوق</h1>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing || isLoading}
            className="text-gray-500 hover:text-diala-600"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'جاري التحديث...' : 'تحديث'}
          </Button>
        </div>

        {lastOrderNumber && (
          <div className="mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span>متابعة حالة الطلب {lastOrderNumber}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>حالة الطلب</SheetTitle>
                  <SheetDescription>
                    متابعة حالة طلبك وجميع التحديثات الخاصة به
                  </SheetDescription>
                </SheetHeader>
                {orderDetails && (
                  <OrderStatusPanel order={orderDetails} />
                )}
              </SheetContent>
            </Sheet>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>المنتجات ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b">
                        <Skeleton className="w-24 h-24 rounded-md" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : cartItemsWithProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">السلة فارغة</p>
                    <Button asChild>
                      <Link to="/products">استعراض المنتجات</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItemsWithProducts.map((item) => {
                      if (!item.product) return null;

                      return (
                        <div key={item.productId} className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="h-20 w-20 overflow-hidden rounded border bg-gray-50">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/products/${item.product.category}/${item.product.id}`}
                              className="text-lg font-medium text-diala-700 hover:text-diala-900 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {getCategoryName(item.product.category)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="w-24 text-right font-medium">
                            {item.product.price ? 
                              `${(item.product.price * item.quantity).toLocaleString()} د.ع` : 
                              'سعر غير متوفر'
                            }
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4 rtl-flip" />
                  <span>متابعة التسوق</span>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => clearCart()}
                >
                  إفراغ السلة
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toLocaleString()} د.ع</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة</span>
                  <span>{(subtotal * 0.05).toLocaleString()} د.ع</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span>{subtotal > 0 ? "5,000 د.ع" : "0 د.ع"}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span>{(subtotal + (subtotal * 0.05) + (subtotal > 0 ? 5000 : 0)).toLocaleString()} د.ع</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-diala-600 hover:bg-diala-700"
                  size="lg"
                  disabled={isLoading || cartItems.length === 0 || orderSubmitted}
                  onClick={openConfirmDialog}
                >
                  {orderSubmitted ? "جاري معالجة الطلب..." : "إتمام الطلب"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* مربع حوار تأكيد الطلب */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الطلب</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد المتابعة؟ سيتم تحويلك إلى صفحة الدفع لإتمام عملية الشراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={continueToShipping}>متابعة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* مربع حوار تسجيل الدخول */}
      <AlertDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تسجيل الدخول مطلوب</AlertDialogTitle>
            <AlertDialogDescription>
              يرجى تسجيل الدخول أو إنشاء حساب جديد للمتابعة إلى إتمام الطلب.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <Button
              className="bg-diala-600 hover:bg-diala-700"
              onClick={redirectToLogin}
            >
              <LogIn className="mr-2 h-4 w-4" />
              تسجيل الدخول
            </Button>
            <Button
              variant="outline"
              className="border-diala-600 text-diala-600"
              onClick={redirectToRegister}
            >
              إنشاء حساب
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* نموذج معلومات الشحن */}
      <Sheet open={shippingFormOpen} onOpenChange={setShippingFormOpen}>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>معلومات الشحن</SheetTitle>
            <SheetDescription>
              يرجى إدخال عنوان الشحن ومعلومات الاتصال لإتمام طلبك
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ShippingForm onSubmit={handleCheckout} isProcessing={orderSubmitted} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart; 
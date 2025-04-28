import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, FileText, ListFilter, Send, ShoppingCart, Package, MessageSquare } from "lucide-react";
import { getCategoryName } from "@/data/products";
import { getProductById, getChildProducts } from "@/utils/productHelpers";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import * as mockProducts from "@/data/products";

// نموذج بيانات طلب المواصفات الخاصة
interface CustomOrderData {
  customerName: string;
  contactInfo: string;
  description: string;
  capacity?: string;
  voltage?: string;
  fibers?: number;
  quantity: number;
  needConsultation: boolean;
}

// نموذج بيانات طلب الاستشارة
interface ConsultationData {
  customerName: string;
  contactInfo: string;
  description: string;
  consultationType: "technical" | "quotation" | "custom";
}

const ProductOptions = () => {
  const { productId, category } = useParams<{ productId: string, category: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [childProducts, setChildProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("variants");
  const [quantity, setQuantity] = useState(1);
  
  // نموذج طلب مواصفات خاصة
  const [customOrderData, setCustomOrderData] = useState<CustomOrderData>({
    customerName: "",
    contactInfo: "",
    description: "",
    capacity: "",
    voltage: "",
    fibers: undefined,
    quantity: 1,
    needConsultation: false
  });
  
  // نموذج طلب استشارة
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    customerName: "",
    contactInfo: "",
    description: "",
    consultationType: "technical"
  });
  
  // تحميل بيانات المنتج وأنواعه الفرعية
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) {
        setError("لم يتم تحديد رقم معرف المنتج");
        setLoading(false);
        return;
      }
      
      try {
        console.log(`ProductOptions: تحميل بيانات المنتج بالمعرف: ${productId}`);
        let mainProduct = null;
        let variants: Product[] = [];
        
        // محاولة الحصول على المنتج من واجهة برمجة التطبيقات
        try {
          mainProduct = await getProductById(productId);
          console.log(`ProductOptions: حالة تحميل المنتج:`, mainProduct ? "تم التحميل" : "فشل التحميل");
        } catch (apiError) {
          console.error("ProductOptions: خطأ أثناء تحميل بيانات المنتج من واجهة برمجة التطبيقات:", apiError);
        }
        
        // إذا لم يتم العثور على المنتج، استخدم البيانات المحلية مباشرة
        if (!mainProduct) {
          console.log("ProductOptions: استخدام البيانات المحلية للمنتج");
          mainProduct = mockProducts.getProductById(productId);
          if (!mainProduct) {
            throw new Error("لم يتم العثور على المنتج في البيانات المحلية أيضاً");
          }
        }
        
        // تعيين المنتج ومتغير الاختيار
        setProduct(mainProduct);
        setSelectedVariant(mainProduct);
        
        // تحميل الأنواع الفرعية
        try {
          variants = await getChildProducts(productId);
          console.log(`ProductOptions: تم تحميل ${variants.length} من الأنواع الفرعية`);
        } catch (variantsError) {
          console.error("ProductOptions: خطأ أثناء تحميل الأنواع الفرعية:", variantsError);
          
          // محاولة استخدام البيانات المحلية للأنواع الفرعية
          variants = mockProducts.getChildProducts(productId);
          console.log(`ProductOptions: تم استخدام البيانات المحلية لـ ${variants.length} من الأنواع الفرعية`);
        }
        
        // تعيين الأنواع الفرعية
        setChildProducts(variants);
        
        // تعيين علامة التبويب النشطة بناءً على البيانات المتاحة
        if (variants.length > 0) {
          setActiveTab("variants");
        } else if (mainProduct.isCustomizable) {
          setActiveTab("custom");
        } else {
          setActiveTab("consultation");
        }
      } catch (err) {
        console.error("ProductOptions: خطأ أثناء تحميل البيانات:", err);
        setError("فشل في تحميل بيانات المنتج. يرجى المحاولة مرة أخرى لاحقاً.");
      } finally {
        setLoading(false);
      }
    };
    
    loadProductData();
  }, [productId]);
  
  // إضافة المنتج المحدد إلى سلة التسوق
  const handleAddToCart = async () => {
    if (selectedVariant) {
      try {
        await addToCart(selectedVariant.id, quantity);
        toast({
          title: "تمت الإضافة إلى السلة",
          description: `تمت إضافة "${selectedVariant.name}" إلى سلة التسوق.`,
        });
        navigate('/cart');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء إضافة المنتج إلى السلة."
        });
      }
    }
  };
  
  // تحديث بيانات طلب المواصفات الخاصة
  const handleCustomOrderChange = (field: keyof CustomOrderData, value: any) => {
    setCustomOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // تحديث بيانات طلب الاستشارة
  const handleConsultationChange = (field: keyof ConsultationData, value: any) => {
    setConsultationData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // إرسال طلب بمواصفات خاصة
  const handleSubmitCustomOrder = () => {
    // التحقق من صحة البيانات المدخلة
    if (!customOrderData.customerName || !customOrderData.contactInfo || !customOrderData.description) {
      toast({
        variant: "destructive",
        title: "بيانات غير مكتملة",
        description: "يرجى ملء جميع الحقول المطلوبة."
      });
      return;
    }
    
    // في النظام الفعلي، هنا سيتم إرسال البيانات إلى API
    console.log("Submitting custom order:", customOrderData);
    
    toast({
      title: "تم إرسال الطلب",
      description: "تم استلام طلبك بنجاح. سيتواصل معك فريق المبيعات قريباً."
    });
    
    // إعادة توجيه المستخدم إلى الصفحة الرئيسية
    setTimeout(() => navigate('/'), 2000);
  };
  
  // إرسال طلب استشارة
  const handleSubmitConsultation = () => {
    // التحقق من صحة البيانات المدخلة
    if (!consultationData.customerName || !consultationData.contactInfo || !consultationData.description) {
      toast({
        variant: "destructive",
        title: "بيانات غير مكتملة",
        description: "يرجى ملء جميع الحقول المطلوبة."
      });
      return;
    }
    
    // في النظام الفعلي، هنا سيتم إرسال البيانات إلى API
    console.log("Submitting consultation request:", consultationData);
    
    toast({
      title: "تم إرسال طلب الاستشارة",
      description: "تم استلام طلبك بنجاح. سيتواصل معك فريق المبيعات قريباً."
    });
    
    // إعادة توجيه المستخدم إلى الصفحة الرئيسية
    setTimeout(() => navigate('/'), 2000);
  };
  
  // عرض الأنواع الفرعية للمنتج
  const renderProductVariants = () => {
    if (childProducts.length === 0) {
      return (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">لا توجد أنواع فرعية متاحة لهذا المنتج</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 flex items-center mb-2">
            <ListFilter className="h-4 w-4 mr-2" />
            الأنواع المتاحة
          </h3>
          <p className="text-sm text-blue-600">
            اختر النوع المناسب لاحتياجاتك من القائمة أدناه.
          </p>
        </div>
        
        <RadioGroup
          value={selectedVariant?.id}
          onValueChange={(value) => {
            const variant = childProducts.find(p => p.id === value) || product;
            if (variant) setSelectedVariant(variant);
          }}
        >
          {childProducts.map((variant) => (
            <div
              key={variant.id}
              className={`p-4 rounded-lg border ${
                selectedVariant?.id === variant.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              } transition-colors mb-3 cursor-pointer`}
              onClick={() => setSelectedVariant(variant)}
            >
              <div className="flex items-start gap-4">
                <RadioGroupItem value={variant.id} id={variant.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={variant.id} className="text-lg font-medium cursor-pointer">
                    {variant.name}
                  </Label>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                    {variant.capacity && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 ml-2">السعة:</span>
                        <span className="font-medium">{variant.capacity}</span>
                      </div>
                    )}
                    {variant.voltage && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 ml-2">الجهد:</span>
                        <span className="font-medium">{variant.voltage}</span>
                      </div>
                    )}
                    {variant.fibers && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 ml-2">عدد الشعيرات:</span>
                        <span className="font-medium">{variant.fibers}</span>
                      </div>
                    )}
                    {variant.phase && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 ml-2">الطور:</span>
                        <span className="font-medium">{variant.phase}</span>
                      </div>
                    )}
                  </div>
                  
                  {variant.price && (
                    <div className="mt-3 text-lg font-bold text-primary">
                      {variant.price.toLocaleString()} د.ع
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
        
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center">
            <Label htmlFor="quantity" className="ml-3">الكمية:</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
          
          <Button onClick={handleAddToCart} disabled={!selectedVariant} className="w-full">
            <ShoppingCart className="ml-2 h-5 w-5" />
            إضافة إلى السلة
          </Button>
        </div>
      </div>
    );
  };
  
  // نموذج طلب المنتج بمواصفات خاصة
  const renderCustomOrderForm = () => {
    // التحقق من نوع المنتج
    const isTransformer = product?.category === "distribution_transformers" || product?.category === "power_transformers";
    const isCable = product?.category === "fiber_cables";
    
    return (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-medium text-green-800 flex items-center mb-2">
            <Settings className="h-4 w-4 mr-2" />
            طلب بمواصفات خاصة
          </h3>
          <p className="text-sm text-green-600">
            يمكنك طلب منتج مخصص حسب احتياجاتك الخاصة. يرجى ملء النموذج التالي.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">اسم العميل</Label>
            <Input
              id="customerName"
              value={customOrderData.customerName}
              onChange={(e) => handleCustomOrderChange('customerName', e.target.value)}
              placeholder="الاسم الكامل"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactInfo">معلومات الاتصال</Label>
            <Input
              id="contactInfo"
              value={customOrderData.contactInfo}
              onChange={(e) => handleCustomOrderChange('contactInfo', e.target.value)}
              placeholder="رقم الهاتف أو البريد الإلكتروني"
            />
          </div>
          
          {isTransformer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">السعة (KVA)</Label>
                <Input
                  id="capacity"
                  value={customOrderData.capacity}
                  onChange={(e) => handleCustomOrderChange('capacity', e.target.value)}
                  placeholder="مثال: 500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voltage">الجهد (KV)</Label>
                <Input
                  id="voltage"
                  value={customOrderData.voltage}
                  onChange={(e) => handleCustomOrderChange('voltage', e.target.value)}
                  placeholder="مثال: 11/0.416"
                />
              </div>
            </div>
          )}
          
          {isCable && (
            <div className="space-y-2">
              <Label htmlFor="fibers">عدد الشعيرات</Label>
              <Input
                id="fibers"
                type="number"
                value={customOrderData.fibers || ""}
                onChange={(e) => handleCustomOrderChange('fibers', parseInt(e.target.value) || undefined)}
                placeholder="مثال: 24"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="quantity">الكمية المطلوبة</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={customOrderData.quantity}
              onChange={(e) => handleCustomOrderChange('quantity', parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">وصف المتطلبات الخاصة</Label>
            <Textarea
              id="description"
              value={customOrderData.description}
              onChange={(e) => handleCustomOrderChange('description', e.target.value)}
              placeholder="يرجى وصف متطلباتك بالتفصيل..."
              rows={4}
            />
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="needConsultation"
              checked={customOrderData.needConsultation}
              onCheckedChange={(checked) => handleCustomOrderChange('needConsultation', checked)}
            />
            <Label htmlFor="needConsultation" className="mr-2 cursor-pointer">
              أحتاج إلى استشارة فنية قبل الطلب
            </Label>
          </div>
          
          <Button onClick={handleSubmitCustomOrder} className="w-full">
            <Send className="ml-2 h-5 w-5" />
            إرسال الطلب
          </Button>
        </div>
      </div>
    );
  };
  
  // نموذج طلب استشارة
  const renderConsultationForm = () => {
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-medium text-purple-800 flex items-center mb-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            طلب استشارة فنية
          </h3>
          <p className="text-sm text-purple-600">
            يمكنك طلب استشارة فنية من فريقنا المتخصص. يرجى ملء النموذج التالي.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="consultCustomerName">اسم العميل</Label>
            <Input
              id="consultCustomerName"
              value={consultationData.customerName}
              onChange={(e) => handleConsultationChange('customerName', e.target.value)}
              placeholder="الاسم الكامل"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consultContactInfo">معلومات الاتصال</Label>
            <Input
              id="consultContactInfo"
              value={consultationData.contactInfo}
              onChange={(e) => handleConsultationChange('contactInfo', e.target.value)}
              placeholder="رقم الهاتف أو البريد الإلكتروني"
            />
          </div>
          
          <div className="space-y-2">
            <Label>نوع الاستشارة</Label>
            <RadioGroup
              value={consultationData.consultationType}
              onValueChange={(value: "technical" | "quotation" | "custom") => 
                handleConsultationChange('consultationType', value)
              }
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="technical" id="technical" />
                <Label htmlFor="technical" className="mr-2 cursor-pointer">
                  استشارة فنية حول المواصفات
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="quotation" id="quotation" />
                <Label htmlFor="quotation" className="mr-2 cursor-pointer">
                  عرض سعر لمنتج بكميات كبيرة
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="mr-2 cursor-pointer">
                  استشارة حول منتج بمواصفات خاصة
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consultDescription">وصف الاستفسار</Label>
            <Textarea
              id="consultDescription"
              value={consultationData.description}
              onChange={(e) => handleConsultationChange('description', e.target.value)}
              placeholder="يرجى وصف استفسارك أو احتياجاتك بالتفصيل..."
              rows={4}
            />
          </div>
          
          <Button onClick={handleSubmitConsultation} className="w-full">
            <Send className="ml-2 h-5 w-5" />
            إرسال طلب الاستشارة
          </Button>
        </div>
      </div>
    );
  };
  
  // عرض شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">جاري تحميل البيانات...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // عرض رسالة الخطأ
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">حدث خطأ</h2>
            <p className="mb-6">{error || "لم يتم العثور على المنتج"}</p>
            <div className="flex flex-col gap-4 items-center">
              <Button asChild>
                <Link to="/products">العودة إلى المنتجات</Link>
              </Button>
              <div className="p-6 border rounded-lg mt-4 max-w-md mx-auto">
                <h3 className="text-lg font-medium mb-4">خيارات بديلة</h3>
                <p className="mb-4">يمكنك تجربة أحد الخيارات التالية:</p>
                <ul className="list-disc list-inside mb-4 text-right">
                  <li className="mb-2">العودة لصفحة المنتج والمحاولة مرة أخرى</li>
                  <li className="mb-2">تصفح فئات المنتجات الأخرى</li>
                  <li className="mb-2">التواصل معنا مباشرة للحصول على مساعدة</li>
                </ul>
                <div className="flex gap-4 justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link to="/contact">تواصل معنا</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* مسار التنقل */}
        <nav className="mb-6">
          <ol className="flex flex-wrap items-center text-sm text-gray-600">
            <li className="flex items-center">
              <Link to="/" className="hover:text-diala-600 transition-colors">الرئيسية</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/products" className="hover:text-diala-600 transition-colors">المنتجات</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link 
                to={`/products/${product.category}`} 
                className="hover:text-diala-600 transition-colors"
              >
                {getCategoryName(product.category)}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link 
                to={`/products/${product.category}/${product.id}`} 
                className="hover:text-diala-600 transition-colors"
              >
                {product.name}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">خيارات المنتج</span>
            </li>
          </ol>
        </nav>
        
        {/* عنوان الصفحة وتفاصيل المنتج */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/4">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-2">
                <Badge variant="secondary" className="ml-2">
                  {getCategoryName(product.category)}
                </Badge>
                {product.isCustomizable && (
                  <Badge variant="outline">
                    <Settings className="h-3 w-3 ml-1" />
                    قابل للتخصيص
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 mb-4">{product.description}</p>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/products/${product.category}/${product.id}`)}
              >
                <Package className="h-4 w-4 ml-2" />
                العودة إلى صفحة المنتج
              </Button>
            </div>
          </div>
        </div>
        
        {/* علامات التبويب للخيارات المختلفة */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="variants" disabled={childProducts.length === 0}>
              <ListFilter className="h-4 w-4 ml-2 hidden sm:inline-block" />
              الأنواع المتاحة
            </TabsTrigger>
            <TabsTrigger value="custom" disabled={!product.isCustomizable}>
              <Settings className="h-4 w-4 ml-2 hidden sm:inline-block" />
              طلب بمواصفات خاصة
            </TabsTrigger>
            <TabsTrigger value="consultation">
              <MessageSquare className="h-4 w-4 ml-2 hidden sm:inline-block" />
              طلب استشارة
            </TabsTrigger>
          </TabsList>
          
          {/* محتوى علامات التبويب */}
          <div className="mt-6 bg-white p-6 rounded-lg border">
            <TabsContent value="variants" className="mt-0">
              {renderProductVariants()}
            </TabsContent>
            
            <TabsContent value="custom" className="mt-0">
              {renderCustomOrderForm()}
            </TabsContent>
            
            <TabsContent value="consultation" className="mt-0">
              {renderConsultationForm()}
            </TabsContent>
          </div>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProductOptions; 
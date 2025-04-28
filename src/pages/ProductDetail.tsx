import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus, Settings, FileText, RefreshCw } from "lucide-react";
import { getCategoryName } from "@/data/products";
import { getProductById, getChildProducts } from "@/utils/productHelpers";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Product } from "@/types";
import { ProductDetailsCard } from "@/components/products/ProductDetailsCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { productId, category } = useParams<{ productId: string, category: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasOptions, setHasOptions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      setError("No product ID provided");
      return;
    }
    
    try {
      setLoading(true);
      const fetchedProduct = await getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        
        // التحقق من وجود خيارات للمنتج (أنواع فرعية أو إمكانية تخصيص)
        const childProducts = await getChildProducts(productId);
        setHasOptions(childProducts.length > 0 || !!fetchedProduct.isCustomizable);
        setError(null);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [productId]);
  
  useEffect(() => {
    loadProduct();
  }, [loadProduct]);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadProduct();
    toast({
      title: "تم التحديث",
      description: "تم تحديث بيانات المنتج",
    });
  };
  
  // Handle adding the product to cart
  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, quantity);
      toast({
        title: "تمت الإضافة إلى السلة",
        description: `تمت إضافة "${product.name}" إلى سلة التسوق.`,
      });
    }
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };
  
  // توجيه المستخدم لصفحة خيارات المنتج
  const handleViewOptions = () => {
    if (product) {
      const optionsUrl = `/products/${product.category}/${product.id}/options`;
      console.log(`توجيه إلى صفحة الخيارات: ${optionsUrl}`);
      
      // التحقق من توفر المعلومات المطلوبة للتوجيه
      if (!product.category || !product.id) {
        toast({
          variant: "destructive",
          title: "تعذر عرض الخيارات",
          description: "معلومات المنتج غير مكتملة. يرجى تحديث الصفحة والمحاولة مرة أخرى."
        });
        return;
      }
      
      try {
        navigate(optionsUrl);
      } catch (error) {
        console.error("خطأ أثناء التوجيه إلى صفحة الخيارات:", error);
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "تعذر عرض صفحة الخيارات. يرجى المحاولة مرة أخرى."
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لم يتم تحميل بيانات المنتج بعد. يرجى الانتظار أو تحديث الصفحة."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="w-full h-96 rounded-lg" />
              <div>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-6" />
                <Skeleton className="h-8 w-1/3 mb-6" />
                <Skeleton className="h-24 w-full mb-6" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
            <p className="mb-6">عذراً، لا يمكن العثور على المنتج المطلوب</p>
            <Button asChild>
              <Link to="/products">العودة إلى المنتجات</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Refresh button */}
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-gray-500 hover:text-diala-600"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'جاري التحديث...' : 'تحديث'}
            </Button>
          </div>
          
          {/* Breadcrumb */}
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
              <li>
                <span className="text-gray-900 font-medium">{product.name}</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold font-heading mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-4">
                {getCategoryName(product.category)}
              </p>
              
              {product.price && (
                <div className="text-2xl font-bold text-diala-600 mb-6">
                  {product.price.toLocaleString()} د.ع
                </div>
              )}
              
              <p className="text-gray-700 mb-6">
                {product.description}
              </p>

              {/* كمية المنتج */}
              <div className="flex items-center mb-6">
                <span className="mr-3 text-gray-700">الكمية:</span>
                <div className="flex items-center border rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={decreaseQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={increaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-diala-600 hover:bg-diala-700 w-full sm:w-auto"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    إضافة إلى السلة
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-diala-600 text-diala-600 hover:bg-diala-50 w-full sm:w-auto"
                    size="lg"
                    onClick={() => navigate('/cart')}
                  >
                    الانتقال إلى السلة
                  </Button>
                </div>
                
                {(hasOptions || product.isCustomizable) && (
                  <div className="flex w-full mt-2">
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 w-full"
                      size="lg"
                      onClick={handleViewOptions}
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      استعراض الخيارات
                    </Button>
                  </div>
                )}
                
                {product.isCustomizable && (
                  <div className="mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium text-slate-700 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      منتج قابل للتخصيص
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      يمكنك طلب هذا المنتج بمواصفات مخصصة أو طلب استشارة فنية عبر استعراض الخيارات.
                    </p>
                  </div>
                )}
              </div>

              <Button 
                variant="ghost"
                className="mt-4"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4 rtl-flip" />
                العودة
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold font-heading mb-6">مواصفات المنتج</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>التفاصيل الفنية</CardTitle>
                <CardDescription>المواصفات التقنية الكاملة للمنتج</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

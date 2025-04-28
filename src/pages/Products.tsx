import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllCategories, getCategoryName, getCategoryProducts } from "@/data/products";
import { ProductCategory, Product } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import categoryIcons from "@/data/categoryIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const { category } = useParams<{ category?: string }>();
  const { toast } = useToast();
  const allCategories = getAllCategories();
  const currentCategory = category as ProductCategory | undefined;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // If invalid category is provided, redirect to all products
  useEffect(() => {
    if (category && !allCategories.includes(category as ProductCategory)) {
      // Could implement a redirect here
      console.error("Invalid category:", category);
    }
  }, [category, allCategories]);

  // Fetch products based on category
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    // Get products based on category
    const fetchedProducts = currentCategory 
      ? getCategoryProducts(currentCategory) 
      : [];
    
    setProducts(fetchedProducts);
    setLoading(false);
    setRefreshing(false);
  }, [currentCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    toast({
      title: "تم التحديث",
      description: "تم تحديث قائمة المنتجات",
    });
  };

  // Skeleton loader for products
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-5 w-1/3 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-diala-50 py-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl md:text-4xl font-bold font-heading">
                {currentCategory ? getCategoryName(currentCategory) : "جميع المنتجات"}
              </h1>
              
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
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                asChild
                variant={!currentCategory ? "default" : "outline"}
                size="sm"
                className={!currentCategory ? "bg-diala-600" : ""}
              >
                <Link to="/products">الكل</Link>
              </Button>
              
              {allCategories.map((cat) => (
                <Button
                  key={cat}
                  asChild
                  variant={currentCategory === cat ? "default" : "outline"}
                  size="sm"
                  className={currentCategory === cat ? "bg-diala-600" : ""}
                >
                  <Link to={`/products/${cat}`}>{getCategoryName(cat)}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {currentCategory ? (
            <>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">لا توجد منتجات في هذه الفئة</h3>
                  <p className="text-gray-600 mb-6">يرجى تحديد فئة أخرى أو العودة لاحقاً</p>
                  <Button asChild>
                    <Link to="/products">جميع المنتجات</Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allCategories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products/${cat}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-diala-100 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={categoryIcons[cat]} 
                      alt={getCategoryName(cat)}
                      className="w-8 h-8 object-contain" 
                      onError={(e) => {
                        // في حالة فشل تحميل الصورة، استخدم الرموز التعبيرية كاحتياطي
                        if (cat === "distribution_transformers" || cat === "power_transformers") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E⚡%3C/text%3E%3C/svg%3E";
                        if (cat === "meters") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E🔌%3C/text%3E%3C/svg%3E";
                        if (cat === "fiber_cables") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E🔄%3C/text%3E%3C/svg%3E";
                        if (cat === "irons") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E🔥%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-1">{getCategoryName(cat)}</h3>
                    <p className="text-gray-600 text-sm">استعراض جميع {getCategoryName(cat)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;

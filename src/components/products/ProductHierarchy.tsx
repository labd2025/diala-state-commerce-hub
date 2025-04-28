import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, Settings } from "lucide-react";
import { Product, ProductCategory } from "@/types";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { getCategoryName } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

// نوع خصائص مكون عرض المنتجات حسب التسلسل الهرمي
interface ProductHierarchyProps {
  categoryId?: ProductCategory;
  showCustomizable?: boolean;
  maxDepth?: number;
  products: Product[];
}

// مكون عرض المنتجات حسب التسلسل الهرمي
export function ProductHierarchy({
  categoryId,
  showCustomizable = true,
  maxDepth = 3,
  products = []
}: ProductHierarchyProps) {
  const [rootProducts, setRootProducts] = useState<Product[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // تحضير المنتجات والتصنيفات الفرعية
  useEffect(() => {
    // إذا تم تحديد فئة محددة، نعرض المنتجات الجذرية لتلك الفئة
    if (categoryId) {
      const filteredRoots = products.filter(
        product => product.category === categoryId && !product.parent_id
      );
      setRootProducts(filteredRoots);
    } else {
      // وإلا نعرض كل المنتجات الجذرية
      const allRoots = products.filter(product => !product.parent_id);
      setRootProducts(allRoots);
    }
  }, [categoryId, products]);

  // توسيع/طي عنصر
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // الحصول على المنتجات الفرعية لمنتج معين
  const getChildrenForProduct = (parentId: string) => {
    return products.filter(product => product.parent_id === parentId);
  };

  // عرض المنتجات المخصصة
  const renderCustomizableProducts = () => {
    if (!showCustomizable) return null;

    const customizableProducts = products.filter(product => product.isCustomizable);
    if (customizableProducts.length === 0) return null;

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">منتجات قابلة للتخصيص</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customizableProducts.map(product => (
            <Card key={product.id} className="h-full overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{getCategoryName(product.category)}</CardDescription>
              </CardHeader>
              {product.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <p className="line-clamp-2 text-gray-600">{product.description}</p>
                <Badge variant="outline" className="mt-2">
                  <Settings className="h-3 w-3 ml-1" />
                  قابل للتخصيص
                </Badge>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/products/${product.id}`}>تفاصيل المنتج</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // عرض منتج فردي
  const renderProductItem = (product: Product, isChildProduct: boolean = false) => {
    const hasChildren = getChildrenForProduct(product.id).length > 0;

    return (
      <div key={product.id} className={`my-2 ${isChildProduct ? "mr-4 border-r-2 border-gray-100 pr-4" : ""}`}>
        <div className="flex items-center">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(product.id)}
              className="p-1"
            >
              {expandedItems[product.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <div className="flex-1">
            <Link
              to={`/products/${product.id}`}
              className="text-md font-medium hover:underline flex items-center"
            >
              {product.name}
              {product.capacity && (
                <Badge variant="outline" className="mr-2">
                  {product.capacity}
                </Badge>
              )}
              {product.isCustomizable && (
                <Badge variant="outline" className="mr-2">
                  <Settings className="h-3 w-3 ml-1" />
                  مخصص
                </Badge>
              )}
            </Link>
            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
            )}
          </div>
        </div>

        {/* عرض المنتجات الفرعية إذا كان العنصر موسعًا */}
        {hasChildren && expandedItems[product.id] && (
          <div className="mt-2">
            {getChildrenForProduct(product.id).map(childProduct => (
              renderProductItem(childProduct, true)
            ))}
          </div>
        )}
      </div>
    );
  };

  // عرض التصنيفات الفرعية
  const renderCategoryGroup = (products: Product[], categoryName: string) => {
    if (products.length === 0) return null;

    const categoryId = `category-${categoryName}`;
    
    return (
      <Collapsible
        defaultOpen={true}
        className="border rounded-lg p-4 mb-4 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{categoryName}</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-5 w-5" />
              <span className="sr-only">توسيع/طي</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-2">
          {products.map(product => renderProductItem(product))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // تجميع المنتجات حسب التصنيف الفرعي
  const groupProductsBySubCategory = (products: Product[]) => {
    const groups: Record<string, Product[]> = {};

    products.forEach(product => {
      const key = product.subCategory || "أخرى";
      
      if (!groups[key]) {
        groups[key] = [];
      }
      
      groups[key].push(product);
    });

    return groups;
  };

  // عرض كل المجموعات المصنفة
  const renderCategorizedGroups = () => {
    const productGroups = groupProductsBySubCategory(rootProducts);
    
    return (
      <>
        {Object.entries(productGroups).map(([groupName, groupProducts]) => (
          renderCategoryGroup(groupProducts, groupName)
        ))}
      </>
    );
  };

  return (
    <div className="container mx-auto py-4">
      {categoryId && (
        <h2 className="text-2xl font-bold mb-6 text-center">
          {getCategoryName(categoryId)}
        </h2>
      )}
      
      {renderCategorizedGroups()}
      {renderCustomizableProducts()}
      
      {rootProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد منتجات متاحة للعرض
        </div>
      )}
    </div>
  );
} 
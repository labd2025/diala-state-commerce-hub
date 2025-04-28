import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, Layers, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getChildProducts } from "@/data/products";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [childCount, setChildCount] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // الحصول على عدد المنتجات الفرعية
    const children = getChildProducts(product.id);
    setChildCount(children.length);
  }, [product.id]);

  const handleAddToCart = async () => {
    // إذا كان المنتج له منتجات فرعية، يجب الاطلاع على التفاصيل أولاً
    if (childCount > 0) {
      toast({
        title: "تحديد المواصفات",
        description: "هذا المنتج له خيارات متعددة. يرجى الاطلاع على التفاصيل لتحديد المواصفات.",
      });
      return;
    }

    await addToCart(product.id, 1);
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تمت إضافة "${product.name}" إلى سلة التسوق.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group h-full flex flex-col">
      <div className="overflow-hidden h-52 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {childCount > 0 && (
          <Badge className="absolute top-2 left-2 bg-diala-600/90" variant="default">
            <Layers className="h-3 w-3 ml-1" />
            {childCount} خيار متاح
          </Badge>
        )}
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-bold text-lg font-heading mb-2 text-gray-900">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        {product.price ? (
          <p className="font-bold text-diala-600">
            يبدأ من {product.price.toLocaleString()} د.ع
          </p>
        ) : childCount > 0 ? (
          <p className="text-diala-600 text-sm">
            تتوفر بمواصفات وأسعار متعددة
          </p>
        ) : (
          <p className="text-gray-500 text-sm italic">
            سعر عند الطلب
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          asChild
          variant="default" 
          size="sm" 
          className="flex-1 bg-diala-600 hover:bg-diala-700"
        >
          <Link to={`/products/${product.category}/${product.id}`}>
            {childCount > 0 ? (
              <>
                <Layers className="h-4 w-4 ml-1" />
                استعراض الخيارات
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 ml-1" />
                التفاصيل
              </>
            )}
          </Link>
        </Button>
        {childCount > 0 ? (
          <Button
            asChild
            variant="outline" 
            size="sm" 
            className="flex-1 border-diala-600 text-diala-600 hover:bg-diala-50"
          >
            <Link to={`/products/${product.category}/${product.id}`}>
              <ArrowRight className="h-4 w-4 ml-1" />
              اختر المنتج
            </Link>
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-diala-600 text-diala-600 hover:bg-diala-50"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 ml-1" />
            اطلب الآن
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

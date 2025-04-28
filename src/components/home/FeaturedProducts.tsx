
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

const FeaturedProducts = () => {
  // Just select a few products to display as featured
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold font-heading">منتجات مميزة</h2>
            <p className="text-gray-600 mt-2">اكتشف أبرز منتجات شركة ديالى العامة</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-diala-600 text-diala-600 hover:bg-diala-50"
          >
            <Link to="/products">
              جميع المنتجات
              <ArrowLeft className="mr-2 h-4 w-4 rtl-flip" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

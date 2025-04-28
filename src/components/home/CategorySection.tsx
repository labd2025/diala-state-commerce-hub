import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCategories, getCategoryName } from "@/data/products";
import { ProductCategory } from "@/types";
import categoryIcons from "@/data/categoryIcons";

const CategorySection = () => {
  const categories = getAllCategories();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">فئات المنتجات</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            تقدم شركة ديالى مجموعة متنوعة من المنتجات الكهربائية عالية الجودة لتلبية مختلف الاحتياجات
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              key={category} 
              to={`/products/${category}`} 
              className="block group h-full"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-diala-400 overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-diala-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    <img 
                      src={categoryIcons[category]} 
                      alt={getCategoryName(category)}
                      className="w-10 h-10 object-contain" 
                      onError={(e) => {
                        if (category === "transformers") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E⚡%3C/text%3E%3C/svg%3E";
                        if (category === "meters") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E🔌%3C/text%3E%3C/svg%3E";
                        if (category === "cables") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E🔄%3C/text%3E%3C/svg%3E";
                        if (category === "irons") e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='12' y='18' font-size='18' text-anchor='middle'%3E🔥%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-heading text-gray-900">
                    {getCategoryName(category)}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-1">
                    اكتشف مجموعتنا المتميزة من {getCategoryName(category)} عالية الجودة
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-diala-600 hover:text-diala-700 hover:bg-diala-50 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform"
                  >
                    عرض المنتجات
                    <ArrowLeft className="mr-2 h-4 w-4 rtl-flip" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

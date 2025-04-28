import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Hero = () => {
  return <section className="bg-gradient-to-b from-diala-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight text-gray-900">شركة ديالى العامة</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              أكثر من 40 عاماً من الخبرة في مجال الصناعات الكهربائية، نقدم منتجات عالية الجودة تلبي احتياجات السوق المحلي والعالمي
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-diala-600 hover:bg-diala-700 text-white">
                <Link to="/products">
                  استعرض منتجاتنا
                  <ArrowRight className="mr-2 h-4 w-4 rtl-flip" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-diala-600 text-diala-600 hover:bg-diala-50">
                <Link to="/contact">
                  تواصل معنا
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img src="/src/assets/categories/hero-bg.jpg" alt="شركة ديالى العامة" className="w-full h-auto object-cover transform scale-105 hover:scale-100 transition-transform duration-700 ease-out" />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;
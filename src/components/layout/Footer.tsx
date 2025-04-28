
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-diala-950 text-white mt-16">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">شركة ديالى العامة</h3>
            <p className="text-gray-300 mb-4">
              شركة ديالى العامة إحدى تشكيلات وزارة الصناعة والمعادن متخصصة بإنتاج المحولات والمقاييس الكهربائية والقابلوات الضوئية والمكواة البخاري.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/dialastatcompany/" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">فيسبوك</span>
              </a>
              <a href="https://www.instagram.com/dialacompany2024/" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">انستغرام</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">تويتر</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">منتجاتنا</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">عن الشركة</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">اتصل بنا</Link>
              </li>
              <li>
                <Link to="/request" className="text-gray-300 hover:text-white transition-colors">طلب منتج</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-heading">معلومات الاتصال</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-diala-400 mt-0.5" />
                <span className="text-gray-300">العراق، محافظة ديالى، بعقوبة</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-diala-400" />
                <span className="text-gray-300"> 07707520059 964+</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-diala-400" />
                <span className="text-gray-300">diala.comp@industry.gov.iq</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} شركة ديالى العامة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

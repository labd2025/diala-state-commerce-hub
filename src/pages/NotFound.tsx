
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <h1 className="text-6xl lg:text-9xl font-bold text-diala-600 mb-4">404</h1>
          <p className="text-2xl text-gray-800 mb-6 font-heading">الصفحة غير موجودة</p>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها أو حذفها.
          </p>
          <Button asChild size="lg" className="bg-diala-600 hover:bg-diala-700">
            <Link to="/">
              العودة إلى الصفحة الرئيسية
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth(); // Get auth state and signOut function
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signingOut, setSigningOut] = useState(false);

  // بدلاً من مجرد تحديد الرابط، سنتعامل مع الزر بشكل أكثر تفاعلية
  const accountLink = loading ? '#' : user ? '/profile' : '/auth';

  // التعامل مع النقر على زر الحساب
  const handleAccountClick = (e: React.MouseEvent) => {
    if (loading) {
      e.preventDefault();
      return;
    }

    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  // التعامل مع تسجيل الخروج
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (signingOut) return; // منع النقرات المتعددة
    
    setSigningOut(true);
    
    try {
      // محاولة مباشرة مع Supabase لتسجيل الخروج
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // استدعاء وظيفة signOut من AuthContext
      await signOut();
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نأمل أن نراك قريباً",
      });
      
      // إضافة تأخير قصير قبل التوجيه للتأكد من إتمام تسجيل الخروج
      setTimeout(() => {
        window.location.href = "/"; // استخدام توجيه مباشر بدلاً من navigate
      }, 500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل تسجيل الخروج",
        description: "يرجى المحاولة مرة أخرى",
      });
      console.error("Error signing out:", error);
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/src/logo.png" 
              alt="شركة ديالى العامة" 
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                // إذا تعذر تحميل الصورة، استخدم لوجو بديل متضمن في الصفحة
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23ff5733'/%3E%3Ctext x='20' y='25' font-family='Arial' font-size='14' text-anchor='middle' fill='white'%3ED%3C/text%3E%3C/svg%3E";
              }}
            />
            <span className="text-lg font-heading font-bold text-diala-600">شركة ديالى العامة</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-800 hover:text-diala-600 transition-colors">الرئيسية</Link>
            <Link to="/products" className="text-sm font-medium text-gray-800 hover:text-diala-600 transition-colors">المنتجات</Link>
            <Link to="/about" className="text-sm font-medium text-gray-800 hover:text-diala-600 transition-colors">عن الشركة</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-800 hover:text-diala-600 transition-colors">اتصل بنا</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-700">
              <Search className="h-4 w-4" />
              <span className="sr-only">بحث</span>
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="text-gray-700">
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">عربة التسوق</span>
              </Button>
            </Link>
            {user ? (
              <div className="relative">
                <Button variant="ghost" size="sm" className="text-gray-700" onClick={handleAccountClick}>
                  <User className="h-4 w-4" />
                  <span className="sr-only">الحساب</span>
                </Button>
                
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="text-gray-700" onClick={handleAccountClick} disabled={loading}>
                <User className="h-4 w-4" />
                <span className="sr-only">تسجيل الدخول</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">القائمة</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full w-3/4 max-w-xs p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <span className="text-base font-bold">القائمة</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">إغلاق</span>
              </Button>
            </div>
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-sm font-medium p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                to="/products" 
                className="text-sm font-medium p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                عن الشركة
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              {user ? (
                <>
                  <Button 
                    variant="ghost"
                    className="text-sm font-medium text-start p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/profile');
                    }}
                  >
                    حسابي
                  </Button>
                  <Button 
                    variant="ghost"
                    className="text-sm font-medium text-start p-2 text-red-600 hover:bg-red-50 rounded-md"
                    onClick={async (e) => {
                      setIsMenuOpen(false);
                      await handleSignOut(e);
                    }}
                    disabled={signingOut}
                  >
                    {signingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost"
                  className="text-sm font-medium text-start p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/auth');
                  }}
                >
                  تسجيل الدخول
                </Button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

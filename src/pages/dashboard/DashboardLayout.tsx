import { FC, ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  BarChart, 
  Settings, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  User, 
  Home, 
  LogOut,
  Briefcase,
  CircuitBoard,
  Shield
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * تخطيط عام للوحة التحكم يتكيف مع دور المستخدم الحالي
 */
const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // التحقق من وجود المستخدم - يجب أن يكون متاحاً بالفعل بسبب RoleBasedRoute
  if (!user) {
    return null;
  }
  
  // وظيفة مساعدة للتحقق من النشاط في المسار
  const isActive = (path: string) => {
    return location.pathname === path ? "bg-diala-50 text-diala-600" : "text-gray-700 hover:bg-gray-100";
  };
  
  // التعامل مع تسجيل الخروج
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  // إنشاء عناصر القائمة حسب دور المستخدم
  const getMenuItems = (role: UserRole) => {
    const commonItems = [
      {
        label: "الرئيسية",
        icon: <Home className="h-5 w-5 ml-2" />,
        path: "/dashboard",
      },
      {
        label: "الملف الشخصي",
        icon: <User className="h-5 w-5 ml-2" />,
        path: "/profile",
      }
    ];
    
    // العناصر الخاصة بكل دور
    const roleSpecificItems: Record<UserRole, { label: string; icon: ReactNode; path: string }[]> = {
      admin: [
        {
          label: "المستخدمين",
          icon: <Users className="h-5 w-5 ml-2" />,
          path: "/dashboard/admin/users",
        },
        {
          label: "المنتجات",
          icon: <Package className="h-5 w-5 ml-2" />,
          path: "/dashboard/admin/products",
        },
        {
          label: "الطلبات",
          icon: <ShoppingBag className="h-5 w-5 ml-2" />,
          path: "/dashboard/admin/orders",
        },
        {
          label: "التقارير",
          icon: <BarChart className="h-5 w-5 ml-2" />,
          path: "/dashboard/admin/reports",
        },
        {
          label: "الإعدادات",
          icon: <Settings className="h-5 w-5 ml-2" />,
          path: "/dashboard/admin/settings",
        }
      ],
      department_manager: [
        {
          label: "الطلبات",
          icon: <ShoppingBag className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales/orders",
        },
        {
          label: "عروض الأسعار",
          icon: <FileText className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales/quotations",
        },
        {
          label: "طلبات المواصفات الخاصة",
          icon: <Settings className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales/custom-orders",
        },
        {
          label: "التقارير",
          icon: <BarChart className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales/reports",
        },
        {
          label: "العملاء",
          icon: <Users className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales/customers",
        }
      ],
      executive: [
        {
          label: "الاستشارات الفنية",
          icon: <CircuitBoard className="h-5 w-5 ml-2" />,
          path: "/dashboard/technical/consultations",
        },
        {
          label: "طلبات المواصفات الخاصة",
          icon: <Settings className="h-5 w-5 ml-2" />,
          path: "/dashboard/technical/custom-specs",
        },
        {
          label: "التقارير الفنية",
          icon: <BarChart className="h-5 w-5 ml-2" />,
          path: "/dashboard/technical/reports",
        },
        {
          label: "المعايير الفنية",
          icon: <FileText className="h-5 w-5 ml-2" />,
          path: "/dashboard/technical/standards",
        }
      ],
      sales_employee: [
        {
          label: "الرسائل",
          icon: <MessageSquare className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales_employee/messages",
        },
        {
          label: "الاستفسارات",
          icon: <MessageSquare className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales_employee/inquiries",
        },
        {
          label: "المراجعات",
          icon: <FileText className="h-5 w-5 ml-2" />,
          path: "/dashboard/sales_employee/reviews",
        }
      ],
      customer: [] // لا توجد عناصر للعميل في لوحة التحكم
    };
    
    // دمج العناصر المشتركة مع العناصر الخاصة بالدور
    return [...commonItems, ...roleSpecificItems[role]];
  };
  
  // الحصول على عناصر القائمة المناسبة للمستخدم الحالي
  const menuItems = getMenuItems(userRole);
  
  // الحصول على عنوان لوحة التحكم حسب الدور
  const getDashboardTitle = (role: UserRole) => {
    const titles: Record<UserRole, string> = {
      admin: "لوحة تحكم المدير",
      department_manager: "لوحة تحكم مدير القسم",
      executive: "لوحة تحكم التنفيذي",
      sales_employee: "لوحة تحكم موظف المبيعات",
      customer: "الملف الشخصي"
    };
    
    return titles[role];
  };
  
  // الحصول على أيقونة الدور
  const getRoleIcon = (role: UserRole) => {
    const icons: Record<UserRole, ReactNode> = {
      admin: <Shield className="h-6 w-6 ml-2 text-red-500" />,
      department_manager: <Briefcase className="h-6 w-6 ml-2 text-blue-500" />,
      executive: <CircuitBoard className="h-6 w-6 ml-2 text-green-500" />,
      sales_employee: <MessageSquare className="h-6 w-6 ml-2 text-purple-500" />,
      customer: <User className="h-6 w-6 ml-2 text-gray-500" />
    };
    
    return icons[role];
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* القائمة الجانبية */}
          <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
            <div className="mb-6 p-4 border-b">
              <div className="flex items-center">
                {getRoleIcon(userRole)}
                <h2 className="text-lg font-bold text-gray-900">{getDashboardTitle(userRole)}</h2>
              </div>
              <p className="text-sm text-gray-600 mt-2">{user.email}</p>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center p-3 rounded-md transition-colors ${isActive(item.path)}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 p-3"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 ml-2" />
                تسجيل الخروج
              </Button>
            </nav>
          </aside>
          
          {/* المحتوى الرئيسي */}
          <main className="flex-1 bg-white rounded-lg shadow-md p-6">
            {children}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout; 
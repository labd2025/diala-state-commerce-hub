import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, ShoppingBag, Settings, LogOut, Users, BarChart3, Truck, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نأمل أن نراك قريباً",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "فشل تسجيل الخروج",
        description: "يرجى المحاولة مرة أخرى",
      });
    }
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const items = [
      { icon: Home, label: "لوحة التحكم", href: "/dashboard" },
      { icon: User, label: "الملف الشخصي", href: "/dashboard/profile" },
    ];

    // Role-specific menu items
    switch (userRole) {
      case "admin":
        return [
          ...items,
          { icon: Users, label: "إدارة المستخدمين", href: "/dashboard/users" },
          { icon: ShoppingBag, label: "إدارة المنتجات", href: "/dashboard/products" },
          { icon: BarChart3, label: "التقارير", href: "/dashboard/reports" },
          { icon: Settings, label: "إعدادات النظام", href: "/dashboard/settings" },
        ];
      case "executive":
        return [
          ...items,
          { icon: BarChart3, label: "التقارير التنفيذية", href: "/dashboard/executive-reports" },
          { icon: Users, label: "الموظفين", href: "/dashboard/employees" },
        ];
      case "department_manager":
        return [
          ...items,
          { icon: Users, label: "فريق العمل", href: "/dashboard/team" },
          { icon: ShoppingBag, label: "المنتجات", href: "/dashboard/products" },
          { icon: BarChart3, label: "تقارير القسم", href: "/dashboard/department-reports" },
        ];
      case "sales_employee":
        return [
          ...items,
          { icon: ShoppingBag, label: "المبيعات", href: "/dashboard/sales" },
          { icon: Truck, label: "الطلبات", href: "/dashboard/orders" },
        ];
      case "customer":
        return [
          ...items,
          { icon: ShoppingBag, label: "طلباتي", href: "/dashboard/my-orders" },
          { icon: Truck, label: "تتبع الشحنات", href: "/dashboard/shipments" },
        ];
      default:
        return items;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 rounded-lg bg-white shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">{user?.user_metadata?.full_name || "المستخدم"}</h2>
              <p className="text-sm text-gray-500">{userRole ? userRole : "مستخدم"}</p>
            </div>
            <ScrollArea className="h-[calc(100vh-220px)]">
              <nav className="p-4 space-y-2">
                {navItems.map((item, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </nav>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="bg-white rounded-lg shadow p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 
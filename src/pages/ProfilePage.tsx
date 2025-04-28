import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Shield, Settings } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import Footer from "@/components/layout/Footer";

// تحديد الأدوار المسموح لها بالوصول إلى لوحة التحكم
const DASHBOARD_ALLOWED_ROLES: UserRole[] = ['admin', 'executive', 'department_manager', 'sales_employee'];

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || "",
  });

  // التحقق من دور المستخدم للوصول إلى لوحة التحكم
  const userRole = (user?.user_metadata?.role as UserRole) || 'customer';
  const canAccessDashboard = DASHBOARD_ALLOWED_ROLES.includes(userRole);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // تحديث بيانات المستخدم في Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "فشل تحديث الملف الشخصي",
        description: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        user?.email || '',
        { redirectTo: `${window.location.origin}/auth/reset-password` }
      );
      
      if (error) throw error;
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى التحقق من بريدك الإلكتروني",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "فشل إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى المحاولة مرة أخرى"
      });
    }
  };

  const handleSignOut = async () => {
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
      
      // تأخير قصير قبل التوجيه
      setTimeout(() => {
        window.location.href = "/"; // استخدام توجيه مباشر بدلاً من navigate
      }, 500);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "فشل تسجيل الخروج",
        description: "يرجى المحاولة مرة أخرى",
      });
      setSigningOut(false);
    }
  };

  // وظيفة للحصول على عنوان لوحة التحكم المناسب بناءً على دور المستخدم
  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '/dashboard/admin/users';
      case 'executive':
        return '/dashboard/executive/tasks';
      case 'department_manager':
        return '/dashboard/department/tasks';
      case 'sales_employee':
        return '/dashboard/sales/orders';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">الملف الشخصي</h1>
              <p className="text-muted-foreground">
                إدارة معلومات حسابك الشخصي وتفضيلاتك
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {canAccessDashboard && (
                <Button
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={() => navigate(getDashboardPath(userRole))}
                >
                  <Settings className="h-4 w-4" />
                  لوحة التحكم
                </Button>
              )}
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                <LogOut className="h-4 w-4" />
                {signingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
              </Button>
            </div>
          </div>
          
          {/* عرض معلومات الدور إذا كان المستخدم لديه دور خاص */}
          {userRole !== 'customer' && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center">
                <Shield className="h-5 w-5 ml-2 text-diala-600" />
                <h3 className="font-medium">معلومات الصلاحيات</h3>
              </div>
              <p className="text-sm mt-2">
                دورك الحالي: <span className="font-semibold">{getRoleNameInArabic(userRole)}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                الدور يمنحك صلاحيات خاصة في النظام، بإمكانك استخدام لوحة التحكم للوصول إلى المزيد من الميزات.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
                <CardDescription>تحديث معلوماتك الشخصية</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      لا يمكن تغيير البريد الإلكتروني
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>الأمان</CardTitle>
                <CardDescription>إدارة كلمة المرور وإعدادات الأمان</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>تغيير كلمة المرور</Label>
                  <p className="text-sm text-muted-foreground">
                    يمكنك تغيير كلمة المرور الخاصة بك عن طريق إرسال رابط إعادة تعيين.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handleChangePassword}>
                  إعادة تعيين كلمة المرور
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// وظيفة مساعدة للحصول على اسم الدور بالعربية
function getRoleNameInArabic(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: "مدير النظام",
    executive: "تنفيذي",
    department_manager: "مدير قسم",
    sales_employee: "موظف مبيعات",
    customer: "عميل"
  };
  
  return roleNames[role] || "عميل";
}

export default ProfilePage; 
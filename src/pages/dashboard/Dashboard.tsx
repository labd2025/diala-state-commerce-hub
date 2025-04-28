import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const { userRole } = useAuth();

  // Role-specific dashboard content
  const renderDashboardContent = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "executive":
        return <ExecutiveDashboard />;
      case "department_manager":
        return <DepartmentManagerDashboard />;
      case "sales_employee":
        return <SalesEmployeeDashboard />;
      case "customer":
        return <CustomerDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

// Default dashboard for any authenticated user
const DefaultDashboard = () => (
  <div className="space-y-4">
    <p>مرحباً بك في لوحة التحكم الخاصة بشركة ديالى العامة.</p>
  </div>
);

// Admin dashboard with analytics
const AdminDashboard = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-muted-foreground ml-2" />
            <div className="text-2xl font-bold">2,350</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Package className="h-4 w-4 text-muted-foreground ml-2" />
            <div className="text-2xl font-bold">128</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">الطلبات الجديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ShoppingCart className="h-4 w-4 text-muted-foreground ml-2" />
            <div className="text-2xl font-bold">24</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">معدل النشاط</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-muted-foreground ml-2" />
            <div className="text-2xl font-bold">+12.5%</div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-6">
      <CardHeader>
        <CardTitle>الإحصائيات العامة</CardTitle>
        <CardDescription>نظرة عامة على نشاط الموقع</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center border rounded p-4">
          <p className="text-muted-foreground">بيانات الرسم البياني ستظهر هنا</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Executive dashboard
const ExecutiveDashboard = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,250,000 د.ع</div>
          <p className="text-xs text-muted-foreground">+18% من الشهر الماضي</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إنتاجية الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-muted-foreground">+5% من الشهر الماضي</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">رضا العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">92%</div>
          <p className="text-xs text-muted-foreground">+2% من الشهر الماضي</p>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-6">
      <CardHeader>
        <CardTitle>التقارير التنفيذية</CardTitle>
        <CardDescription>نظرة عامة على أداء الشركة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[200px] flex items-center justify-center border rounded p-4">
            <p className="text-muted-foreground">بيانات الرسم البياني ستظهر هنا</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Department Manager dashboard
const DepartmentManagerDashboard = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">أداء الفريق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">78%</div>
          <p className="text-xs text-muted-foreground">+8% من الشهر الماضي</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إنتاجية القسم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">92%</div>
          <p className="text-xs text-muted-foreground">+4% من الشهر الماضي</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">المنتجات النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">36</div>
          <p className="text-xs text-muted-foreground">+3 من الشهر الماضي</p>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-6">
      <CardHeader>
        <CardTitle>أداء الموظفين</CardTitle>
        <CardDescription>نظرة عامة على أداء فريق العمل</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[200px] flex items-center justify-center border rounded p-4">
            <p className="text-muted-foreground">بيانات الرسم البياني ستظهر هنا</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Sales Employee dashboard
const SalesEmployeeDashboard = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">مبيعاتي الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">450,000 د.ع</div>
          <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">الطلبات الجديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">+3 من الأسبوع الماضي</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">رضا العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94%</div>
          <p className="text-xs text-muted-foreground">+2% من الشهر الماضي</p>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-6">
      <CardHeader>
        <CardTitle>الطلبات الأخيرة</CardTitle>
        <CardDescription>آخر 5 طلبات تم استلامها</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">قائمة الطلبات ستظهر هنا</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Customer dashboard
const CustomerDashboard = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">طلباتي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">3 طلبات جديدة</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">طلبات قيد التنفيذ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">1 في مرحلة الشحن</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">طلبات مكتملة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">6</div>
          <p className="text-xs text-muted-foreground">آخر طلب منذ 3 أيام</p>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-6">
      <CardHeader>
        <CardTitle>آخر الطلبات</CardTitle>
        <CardDescription>آخر المنتجات التي طلبتها</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">قائمة الطلبات ستظهر هنا</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Dashboard; 
import { FC, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, BarChart, ShoppingBag, Users, Package, MessageSquare, Settings, CircuitBoard, Briefcase, User } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  linkText: string;
}

const RoleCard: FC<RoleCardProps> = ({ title, description, icon, link, linkText }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center">
        {icon}
        <CardTitle className="mr-2">{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Link 
        to={link} 
        className="inline-flex items-center rounded-md bg-diala-50 px-3 py-1.5 text-sm font-medium text-diala-600 hover:bg-diala-100 transition-colors"
      >
        {linkText}
      </Link>
    </CardContent>
  </Card>
);

const DashboardHome: FC = () => {
  const { userRole, user } = useAuth();
  
  // الحصول على اسم المستخدم
  const userFullName = user?.user_metadata?.full_name || user?.email || "المستخدم";
  
  // الحصول على مسار للوحة التحكم المناسبة حسب الدور
  const getRoleDashboardPath = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return '/dashboard/admin/users';
      case 'executive':
        return '/dashboard/technical/consultations';
      case 'department_manager':
        return '/dashboard/sales/orders';
      case 'sales_employee':
        return '/dashboard/sales_employee/messages';
      default:
        return '/dashboard';
    }
  };
  
  // الحصول على عنوان لوحة التحكم حسب الدور
  const getRoleDashboardTitle = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'لوحة تحكم مدير النظام';
      case 'executive':
        return 'لوحة تحكم التنفيذي';
      case 'department_manager':
        return 'لوحة تحكم مدير القسم';
      case 'sales_employee':
        return 'لوحة تحكم موظف المبيعات';
      default:
        return 'لوحة التحكم';
    }
  };
  
  // توليد البطاقات المناسبة بناءً على دور المستخدم
  const renderRoleBasedCards = () => {
    // بطاقات مدير النظام
    if (userRole === 'admin') {
      return (
        <>
          <RoleCard 
            title="إدارة المستخدمين" 
            description="إضافة وتعديل وحذف المستخدمين وإدارة الأدوار والصلاحيات" 
            icon={<Users className="h-8 w-8 text-blue-600" />}
            link="/dashboard/admin/users"
            linkText="إدارة المستخدمين"
          />
          <RoleCard 
            title="إدارة المنتجات" 
            description="إضافة وتعديل وحذف المنتجات والفئات والمواصفات" 
            icon={<Package className="h-8 w-8 text-green-600" />}
            link="/dashboard/admin/products"
            linkText="إدارة المنتجات"
          />
          <RoleCard 
            title="إدارة الطلبات" 
            description="عرض ومتابعة وتحديث حالات جميع الطلبات في النظام" 
            icon={<ShoppingBag className="h-8 w-8 text-purple-600" />}
            link="/dashboard/admin/orders"
            linkText="إدارة الطلبات"
          />
          <RoleCard 
            title="التقارير والإحصائيات" 
            description="عرض تقارير المبيعات والأداء وإحصائيات النظام" 
            icon={<BarChart className="h-8 w-8 text-amber-600" />}
            link="/dashboard/admin/reports"
            linkText="عرض التقارير"
          />
        </>
      );
    }
    
    // بطاقات التنفيذي (كان سابقًا المدير الفني)
    if (userRole === 'executive') {
      return (
        <>
          <RoleCard 
            title="الاستشارات الفنية" 
            description="إدارة طلبات الاستشارات الفنية من العملاء" 
            icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
            link="/dashboard/technical/consultations"
            linkText="إدارة الاستشارات"
          />
          <RoleCard 
            title="طلبات المواصفات الخاصة" 
            description="متابعة طلبات المنتجات ذات المواصفات الخاصة" 
            icon={<Settings className="h-8 w-8 text-green-600" />}
            link="/dashboard/technical/custom-specs"
            linkText="عرض الطلبات الخاصة"
          />
        </>
      );
    }
    
    // بطاقات مدير القسم (كان سابقًا مدير المبيعات)
    if (userRole === 'department_manager') {
      return (
        <>
          <RoleCard 
            title="إدارة طلبات المبيعات" 
            description="متابعة وإدارة طلبات المبيعات والتواصل مع العملاء" 
            icon={<ShoppingBag className="h-8 w-8 text-blue-600" />}
            link="/dashboard/sales/orders"
            linkText="إدارة الطلبات"
          />
          <RoleCard 
            title="عروض الأسعار" 
            description="إدارة عروض الأسعار وتقديم العروض للعملاء" 
            icon={<BarChart className="h-8 w-8 text-green-600" />}
            link="/dashboard/sales/quotations"
            linkText="إدارة العروض"
          />
        </>
      );
    }
    
    // بطاقات موظف المبيعات (كان سابقًا المشرف)
    if (userRole === 'sales_employee') {
      return (
        <>
          <RoleCard 
            title="إدارة الرسائل" 
            description="إدارة رسائل العملاء والرد عليها" 
            icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
            link="/dashboard/sales_employee/messages"
            linkText="إدارة الرسائل"
          />
          <RoleCard 
            title="إدارة الاستفسارات" 
            description="إدارة استفسارات العملاء وتوجيهها للأقسام المختصة" 
            icon={<MessageSquare className="h-8 w-8 text-green-600" />}
            link="/dashboard/sales_employee/inquiries"
            linkText="إدارة الاستفسارات"
          />
        </>
      );
    }
    
    // الحالة الافتراضية
    return null;
  };

  // وظيفة مساعدة لعرض أيقونة ووصف الدور بناءً على مستوى المستخدم
  const getRoleDisplayInfo = (role: UserRole): { icon: ReactNode; description: string } => {
    const roleInfo: Record<UserRole, { icon: ReactNode; description: string }> = {
      admin: {
        icon: <Shield className="h-8 w-8 text-red-600" />,
        description: "أنت مدير نظام لديك وصول كامل لجميع وظائف النظام. يمكنك إدارة المستخدمين، المنتجات، الطلبات، والإعدادات."
      },
      executive: {
        icon: <CircuitBoard className="h-8 w-8 text-green-600" />,
        description: "أنت تنفيذي لديك صلاحيات إدارة الاستشارات الفنية وطلبات المواصفات الخاصة."
      },
      department_manager: {
        icon: <Briefcase className="h-8 w-8 text-blue-600" />,
        description: "أنت مدير قسم مسؤول عن إدارة طلبات المبيعات وعروض الأسعار."
      },
      sales_employee: {
        icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
        description: "أنت موظف مبيعات مسؤول عن إدارة وتنسيق الرسائل والاستفسارات."
      },
      customer: {
        icon: <User className="h-8 w-8 text-gray-600" />,
        description: "أنت عميل يمكنك تصفح المنتجات وإجراء الطلبات."
      }
    };
    
    return roleInfo[role];
  };

  // إضافة قسم في واجهة المستخدم يشرح الدور ومسؤولياته
  const RoleInfoSection = ({ role }: { role: UserRole }) => {
    const { icon, description } = getRoleDisplayInfo(role);
    
    return (
      <div className="mt-8 p-4 bg-slate-50 rounded-lg border">
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="font-medium mr-2 text-lg">معلومات دورك في النظام</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {description}
        </p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">أهلا بك في {getRoleDashboardTitle(userRole)}</h1>
      <p className="text-gray-500 mb-6">مرحباً {userFullName}، يمكنك استخدام اللوحة لإدارة النظام وفقاً لصلاحياتك.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {renderRoleBasedCards()}
      </div>
      
      <RoleInfoSection role={userRole} />
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

export default DashboardHome; 
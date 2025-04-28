import { FC, ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * مكون يتحقق من صلاحية الوصول استناداً إلى دور المستخدم
 * يسمح فقط للمستخدمين ذوي الأدوار المحددة بالوصول
 */
const RoleBasedRoute: FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/",
}) => {
  const { user, loading, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // إضافة وظيفة لإظهار التنبيه عند عدم وجود صلاحية
  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(userRole)) {
      toast({
        variant: "destructive",
        title: "خطأ في الصلاحيات",
        description: "ليس لديك صلاحية الوصول إلى هذه الصفحة",
      });
    }
  }, [loading, user, userRole, allowedRoles, toast]);

  // إذا كان التحميل جارٍ، يمكننا عرض شاشة تحميل
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 mx-auto rounded-full border-4 border-diala-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // تحقق من وجود المستخدم ودوره
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // التحقق من صلاحية الدور
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  // إذا كان المستخدم يتمتع بالصلاحيات المطلوبة، عرض المحتوى
  return <>{children}</>;
};

export default RoleBasedRoute; 
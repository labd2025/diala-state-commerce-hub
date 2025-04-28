import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2, UserPlus, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@supabase/supabase-js";
import UserRoleManager from "./components/UserRoleManager";

// تعريف ROLE_TRANSLATION مع الأدوار الحالية
const ROLE_TRANSLATION: Record<string, string> = {
  admin: "مدير النظام",
  executive: "تنفيذي",
  department_manager: "مدير قسم",
  sales_employee: "موظف مبيعات",
  customer: "عميل",
};

// القيم القديمة والجديدة للأدوار
const roleMapping: Record<string, UserRole> = {
  'user': 'customer',
  'sales_manager': 'department_manager',
  'technical_manager': 'executive',
  'moderator': 'sales_employee',
  'admin': 'admin'
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser, updateUserRole } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fixingAllRoles, setFixingAllRoles] = useState(false);

  // تحميل المستخدمين من قاعدة البيانات
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // جلب المستخدمين من جدول auth.users
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      if (data && data.users) {
        const formattedUsers = data.users.map((user: User) => ({
          id: user.id,
          name: user.user_metadata?.full_name || 'بدون اسم',
          email: user.email,
          role: (user.user_metadata?.role as UserRole) || 'customer',
          status: user.confirmed_at ? 'نشط' : 'معلق',
          needs_role_update: needsRoleUpdate(user.user_metadata?.role)
        }));
        
        setUsers(formattedUsers);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تحميل المستخدمين",
        description: "حدث خطأ أثناء محاولة تحميل بيانات المستخدمين"
      });
      setLoading(false);
    }
  };

  // التحقق مما إذا كان الدور يحتاج للتحديث
  const needsRoleUpdate = (role?: string): boolean => {
    if (!role) return false;
    
    // إذا كان الدور من القيم القديمة ويختلف عن القيمة الجديدة المقابلة له
    return Object.keys(roleMapping).includes(role) && role !== roleMapping[role];
  };

  // إصلاح دور الادمن الحالي إذا كان غير صحيح
  const fixCurrentAdminRole = async () => {
    try {
      setRefreshing(true);
      
      if (!currentUser) {
        throw new Error("يجب تسجيل الدخول لتنفيذ هذه العملية");
      }
      
      // تحديث دور المستخدم الحالي إلى admin
      await updateUserRole('admin');
      
      toast({
        title: "تم تحديث الدور بنجاح",
        description: "تم تحديث دورك إلى مدير النظام"
      });
      
      // إعادة تحميل الصفحة لتطبيق التغييرات
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error fixing admin role:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تحديث الدور",
        description: "حدث خطأ أثناء محاولة تحديث دور المستخدم"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // إصلاح أدوار جميع المستخدمين
  const fixAllUserRoles = async () => {
    try {
      setFixingAllRoles(true);
      
      let updateCount = 0;
      let errorCount = 0;
      
      // تحديث كل مستخدم يحتاج لتحديث
      for (const user of users) {
        if (user.needs_role_update) {
          const oldRole = user.role;
          const newRole = roleMapping[oldRole];
          
          if (newRole) {
            try {
              const { error } = await supabase.auth.admin.updateUserById(user.id, {
                user_metadata: { role: newRole }
              });
              
              if (error) throw error;
              updateCount++;
            } catch (error) {
              console.error(`Error updating user ${user.email}:`, error);
              errorCount++;
            }
          }
        }
      }
      
      // إعادة تحميل المستخدمين بعد التحديث
      await loadUsers();
      
      toast({
        title: "اكتمل تحديث الأدوار",
        description: `تم تحديث ${updateCount} مستخدم بنجاح. فشل تحديث ${errorCount} مستخدم.`
      });
    } catch (error) {
      console.error("Error fixing all roles:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تحديث الأدوار",
        description: "حدث خطأ أثناء محاولة تحديث أدوار المستخدمين"
      });
    } finally {
      setFixingAllRoles(false);
    }
  };

  // تغيير دور مستخدم
  const changeUserRole = async (userId: string, newRole: UserRole) => {
    try {
      // تعديل الأدوار يتطلب تحديث البيانات الوصفية للمستخدم
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole }
      });
      
      if (error) throw error;
      
      toast({
        title: "تم تحديث الدور بنجاح",
        description: `تم تغيير دور المستخدم إلى ${ROLE_TRANSLATION[newRole]}`
      });
      
      // تحديث قائمة المستخدمين
      loadUsers();
    } catch (error) {
      console.error("Error changing user role:", error);
      toast({
        variant: "destructive",
        title: "خطأ في تغيير الدور",
        description: "حدث خطأ أثناء محاولة تغيير دور المستخدم"
      });
    }
  };

  // حذف مستخدم
  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast({
        title: "تم حذف المستخدم بنجاح",
        description: "تم حذف المستخدم من النظام"
      });
      
      // تحديث قائمة المستخدمين
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "خطأ في حذف المستخدم",
        description: "حدث خطأ أثناء محاولة حذف المستخدم"
      });
    }
  };

  // تحميل المستخدمين عند بدء التطبيق
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <div className="flex gap-2">
          <Button
            onClick={fixCurrentAdminRole}
            variant="outline"
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "جاري التحديث..." : "إصلاح دور المشرف"}
          </Button>
          <Button
            onClick={() => navigate('/dashboard/admin/add-user')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            إضافة مستخدم جديد
          </Button>
        </div>
      </div>

      {/* مكون إدارة الأدوار */}
      <UserRoleManager onFixAllRoles={fixAllUserRoles} isFixing={fixingAllRoles} />

      <Card>
        <CardHeader>
          <CardTitle>المستخدمون المسجلون</CardTitle>
          <CardDescription>قائمة بجميع المستخدمين المسجلين في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">جاري تحميل البيانات...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className={user.needs_role_update ? "bg-amber-50" : ""}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {ROLE_TRANSLATION[user.role]}
                      {user.needs_role_update && (
                        <span className="mr-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                          يحتاج للتحديث
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-0 h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/edit-user/${user.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل المعلومات
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-600" onClick={() => changeUserRole(user.id, 'admin')}>
                            تعيين كمدير نظام
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-600" onClick={() => changeUserRole(user.id, 'executive')}>
                            تعيين كتنفيذي
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-600" onClick={() => changeUserRole(user.id, 'department_manager')}>
                            تعيين كمدير قسم
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-600" onClick={() => changeUserRole(user.id, 'sales_employee')}>
                            تعيين كموظف مبيعات
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-600" onClick={() => changeUserRole(user.id, 'customer')}>
                            تعيين كعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
                              deleteUser(user.id);
                            }
                          }}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            حذف المستخدم
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AdminUsers; 
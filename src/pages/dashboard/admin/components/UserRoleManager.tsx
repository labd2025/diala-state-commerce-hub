import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

// القيم القديمة والجديدة للأدوار
const roleMapping: { oldRole: string; newRole: UserRole; arabic: string }[] = [
  { oldRole: "user", newRole: "customer", arabic: "عميل" },
  { oldRole: "sales_manager", newRole: "department_manager", arabic: "مدير قسم" },
  { oldRole: "technical_manager", newRole: "executive", arabic: "تنفيذي" },
  { oldRole: "moderator", newRole: "sales_employee", arabic: "موظف مبيعات" },
  { oldRole: "admin", newRole: "admin", arabic: "مدير النظام" },
];

interface UserRoleManagerProps {
  onFixAllRoles: () => Promise<void>;
  isFixing: boolean;
}

// مكون للمساعدة في إدارة الأدوار وشرح التغييرات
const UserRoleManager: React.FC<UserRoleManagerProps> = ({ onFixAllRoles, isFixing }) => {
  const { toast } = useToast();
  const { userRole } = useAuth();

  // التحقق من أن المستخدم هو مدير النظام
  if (userRole !== 'admin') {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center text-amber-600 mb-2">
            <AlertCircle className="h-5 w-5 ml-2" />
            <p className="font-semibold">هذا القسم مخصص لمديري النظام فقط</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>إدارة أدوار المستخدمين</CardTitle>
        <CardDescription>تم تغيير الأدوار في النظام. استخدم هذه الأداة لمزامنة أدوار المستخدمين الحاليين.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-amber-50 rounded-md text-sm text-amber-800 border border-amber-200">
          <p className="font-semibold mb-1">ملاحظة هامة:</p>
          <p>تم تغيير أسماء الأدوار في النظام لتتوافق مع الهيكل الجديد. يرجى التأكد من تحديث أدوار المستخدمين الحاليين باستخدام زر "تحديث جميع الأدوار" أدناه.</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الدور القديم</TableHead>
              <TableHead>الدور الجديد</TableHead>
              <TableHead>الاسم بالعربية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roleMapping.map((role, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono">{role.oldRole}</TableCell>
                <TableCell className="font-mono">{role.newRole}</TableCell>
                <TableCell>{role.arabic}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          className="mt-4 w-full"
          onClick={async () => {
            try {
              await onFixAllRoles();
              toast({
                title: "تم تحديث الأدوار",
                description: "تم تحديث جميع أدوار المستخدمين بنجاح"
              });
            } catch (error) {
              toast({
                variant: "destructive",
                title: "حدث خطأ",
                description: "لم نتمكن من تحديث أدوار المستخدمين"
              });
            }
          }}
          disabled={isFixing}
        >
          {isFixing ? (
            <>
              <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
              جاري تحديث جميع الأدوار...
            </>
          ) : (
            "تحديث جميع الأدوار"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserRoleManager; 
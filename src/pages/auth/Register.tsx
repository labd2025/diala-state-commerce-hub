import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'customer' as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signUp(formData.email, formData.password, formData.fullName);
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يرجى تأكيد بريدك الإلكتروني للمتابعة"
      });
      navigate('/auth/login');
    } catch (error: any) {
      let errorMessage = "حدث خطأ أثناء محاولة إنشاء الحساب";
      
      if (error?.message?.includes('already registered')) {
        errorMessage = "البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد إلكتروني آخر أو تسجيل الدخول.";
      } else if (error?.message?.includes('password')) {
        errorMessage = "كلمة المرور غير صالحة. يجب أن تكون على الأقل 6 أحرف.";
      }
      
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: errorMessage
      });
      
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            انضم إلى شركة ديالى العامة
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">يجب أن تتكون كلمة المرور من 6 أحرف على الأقل</p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
            سيتم تسجيلك كعميل. للحصول على صلاحيات إضافية، يرجى التواصل مع إدارة النظام.
          </div>

          <Button
            type="submit"
            className="w-full bg-diala-600 hover:bg-diala-700"
            disabled={loading}
          >
            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate('/auth/login')}
              className="text-sm text-diala-600 hover:text-diala-700"
            >
              لديك حساب بالفعل؟ سجل دخول
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;

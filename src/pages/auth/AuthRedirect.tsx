import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import Header from "@/components/layout/Header";

const AuthRedirect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">مرحباً بك</CardTitle>
              <CardDescription>
                يرجى تسجيل الدخول أو إنشاء حساب جديد للمتابعة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button
                  className="h-12 bg-diala-600 hover:bg-diala-700"
                  onClick={() => navigate("/auth/login")}
                >
                  <LogIn className="ml-2 h-5 w-5" />
                  تسجيل الدخول
                </Button>
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={() => navigate("/auth/register")}
                >
                  <UserPlus className="ml-2 h-5 w-5" />
                  إنشاء حساب جديد
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                شركة ديالى العامة - جميع الحقوق محفوظة
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirect; 
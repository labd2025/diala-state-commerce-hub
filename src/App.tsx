import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { logSupabaseStatus, initializeDatabase } from "@/utils/supabaseUtils";
import { UserRole } from "@/types";

// Public pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import ProductOptions from "./pages/ProductOptions";

// Auth pages
import AuthRedirect from "./pages/auth/AuthRedirect";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Profile page
import ProfilePage from "./pages/ProfilePage";

// Dashboard pages
import AdminUsers from "./pages/dashboard/admin/Users";
import AdminProducts from "./pages/dashboard/admin/Products";
import AdminOrders from "./pages/dashboard/admin/Orders";
import DashboardHome from "./pages/dashboard/DashboardHome";
// لاحقاً سيتم استيراد المزيد من صفحات لوحة التحكم

const queryClient = new QueryClient();

// مكون مساعد للتحقق من أدوار المستخدمين وتحديثها إذا لزم الأمر
const RoleChecker = () => {
  const { user, userRole, updateUserRole } = useAuth();
  const [roleCheckComplete, setRoleCheckComplete] = useState(false);

  // التحقق من دور المستخدم وتحديثه إذا لزم الأمر
  useEffect(() => {
    const checkUserRole = async () => {
      if (user && !roleCheckComplete) {
        // إذا كان الدور منسق مع القيم القديمة، قم بتحديثه إلى القيم الجديدة
        const oldToNewRoleMapping: Record<string, UserRole> = {
          'user': 'customer',
          'sales_manager': 'department_manager',
          'technical_manager': 'executive',
          'moderator': 'sales_employee',
          'admin': 'admin'
        };

        const metadataRole = user.user_metadata?.role;
        if (metadataRole && oldToNewRoleMapping[metadataRole]) {
          if (metadataRole !== oldToNewRoleMapping[metadataRole]) {
            console.log(`سيتم تحديث دور المستخدم من ${metadataRole} إلى ${oldToNewRoleMapping[metadataRole]}`);
            try {
              await updateUserRole(oldToNewRoleMapping[metadataRole]);
              console.log('تم تحديث دور المستخدم بنجاح');
            } catch (error) {
              console.error('حدث خطأ أثناء تحديث دور المستخدم:', error);
            }
          }
        }
        
        setRoleCheckComplete(true);
      }
    };
    
    checkUserRole();
  }, [user, roleCheckComplete, updateUserRole]);

  return null; // هذا المكون للمنطق فقط، لا يعرض أي محتوى
};

const App = () => {
  // Check Supabase connection on startup
  useEffect(() => {
    logSupabaseStatus();
    
    const initDb = async () => {
      const isDbInitialized = await initializeDatabase();
      if (!isDbInitialized) {
        console.warn("Database initialization failed - using mock data as fallback");
      }
    };
    
    initDb();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RoleChecker />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/products/:category/:productId" element={<ProductDetail />} />
                <Route path="/products/:category/:productId/options" element={<ProductOptions />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                
                {/* Auth Routes */}
                <Route path="/auth" element={<AuthRedirect />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                
                {/* Profile Route - accessible to any authenticated user */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* Dashboard Routes - based on user role */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin', 'executive', 'department_manager', 'sales_employee']} redirectTo="/profile">
                      <DashboardLayout>
                        <DashboardHome />
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/dashboard/admin/users" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <AdminUsers />
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/products" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <AdminProducts />
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/orders" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <AdminOrders />
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                
                {/* Sales Manager Routes */}
                <Route path="/dashboard/sales/orders" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['department_manager', 'admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <h1 className="text-2xl font-bold mb-6">إدارة طلبات المبيعات</h1>
                        {/* سيتم استبدال هذا بمكون إدارة طلبات المبيعات */}
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/sales/quotations" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['department_manager', 'admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <h1 className="text-2xl font-bold mb-6">عروض الأسعار</h1>
                        {/* سيتم استبدال هذا بمكون عروض الأسعار */}
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                
                {/* Technical Manager Routes */}
                <Route path="/dashboard/technical/consultations" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['executive', 'admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <h1 className="text-2xl font-bold mb-6">الاستشارات الفنية</h1>
                        {/* سيتم استبدال هذا بمكون إدارة الاستشارات الفنية */}
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/technical/custom-specs" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['executive', 'admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <h1 className="text-2xl font-bold mb-6">طلبات المواصفات الخاصة</h1>
                        {/* سيتم استبدال هذا بمكون إدارة طلبات المواصفات الخاصة */}
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                
                {/* Sales Employee Routes */}
                <Route path="/dashboard/sales_employee/messages" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['sales_employee', 'admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <h1 className="text-2xl font-bold mb-6">إدارة الرسائل</h1>
                        {/* سيتم استبدال هذا بمكون إدارة الرسائل */}
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/sales_employee/inquiries" element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['sales_employee', 'admin']} redirectTo="/dashboard">
                      <DashboardLayout>
                        <h1 className="text-2xl font-bold mb-6">إدارة الاستفسارات</h1>
                        {/* سيتم استبدال هذا بمكون إدارة الاستفسارات */}
                      </DashboardLayout>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

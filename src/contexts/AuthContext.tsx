import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  signIn: (provider: 'email', email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // استخراج الدور من بيانات المستخدم metadata
        const role = session.user.user_metadata?.role as UserRole || 'customer';
        setUserRole(role);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // استخراج الدور من بيانات المستخدم metadata
        const role = session.user.user_metadata?.role as UserRole || 'customer';
        setUserRole(role);
      } else {
        setUserRole('customer');
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (provider: 'email', email?: string, password?: string) => {
    try {
      if (provider === 'email' && email && password) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // تحديث الدور بعد تسجيل الدخول
        if (data.user) {
          const role = data.user.user_metadata?.role as UserRole || 'customer';
          setUserRole(role);
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'customer', // تعيين دور المستخدم الجديد كعميل
          }
        }
      });
      
      if (error) throw error;
      
      // تحديث الدور للمستخدم الجديد
      if (data.user) {
        setUserRole('customer');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signOut process');
      
      // إنهاء الجلسة في Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during Supabase signOut:', error);
        throw error;
      }
      
      console.log('Supabase signOut successful');
      
      // تأخير قصير قبل إعادة تعيين حالة المستخدم لضمان اكتمال العملية
      setTimeout(() => {
        // إعادة تعيين حالة المستخدم والدور محلياً
        setUser(null);
        setUserRole('customer');
        console.log('Local user state reset');
        
        // محاولة إزالة أي بيانات جلسة متبقية
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
      }, 300);
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: UserRole) => {
    try {
      if (!user) {
        throw new Error('يجب تسجيل الدخول لتحديث دور المستخدم');
      }

      // تحديث البيانات الوصفية للمستخدم في Supabase
      const { error } = await supabase.auth.updateUser({
        data: { role }
      });

      if (error) throw error;

      // تحديث الدور محلياً
      setUserRole(role);

      return;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, userRole, signIn, signOut, signUp, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

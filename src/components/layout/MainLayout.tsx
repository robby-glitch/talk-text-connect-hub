
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

// Create a context for sharing the session token
export const SessionContext = createContext<{ token: string | null }>({ token: null });

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, signOut, isLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const getSession = async () => {
      if (user) {
        const { data, error } = await supabase.auth.getSession();
        if (data.session && !error) {
          setToken(data.session.access_token);
        }
      }
    };
    
    getSession();
  }, [user]);
  
  // Redirect to login if not authenticated
  if (!user && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <SessionContext.Provider value={{ token }}>
      <div className="flex h-screen">
        <Sidebar onLogout={signOut} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SessionContext.Provider>
  );
};

// Custom hook to use the session context
export const useSession = () => useContext(SessionContext);

export default MainLayout;


import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, signOut, isLoading } = useAuth();
  
  // Redirect to login if not authenticated
  if (!user && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar onLogout={signOut} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};

export default MainLayout;

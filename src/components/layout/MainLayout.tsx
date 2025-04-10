
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

type MainLayoutProps = {
  children: ReactNode;
  onLogout: () => void;
};

const MainLayout = ({ children, onLogout }: MainLayoutProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};

export default MainLayout;

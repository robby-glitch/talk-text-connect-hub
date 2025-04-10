
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  MessageSquare, 
  Users, 
  Clock, 
  Settings, 
  LogOut,
  LucideIcon
} from "lucide-react";

type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

type SidebarProps = {
  onLogout: () => void;
};

const Sidebar = ({ onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    { name: "Calls", path: "/calls", icon: Phone },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Contacts", path: "/contacts", icon: Users },
    { name: "History", path: "/history", icon: Clock },
    { name: "Settings", path: "/settings", icon: Settings },
  ];
  
  return (
    <div className="h-screen bg-sidebar text-sidebar-foreground flex flex-col w-64 p-4">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-md w-10 h-10 flex items-center justify-center mr-3">
          <Phone className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold">Talk Connect</h1>
      </div>
      
      <div className="flex flex-col space-y-1 flex-grow">
        {sidebarItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`justify-start ${
              location.pathname === item.path ? 
              "bg-sidebar-accent text-sidebar-accent-foreground" : 
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </div>
      
      <Separator className="my-4 bg-sidebar-border" />
      
      <Button 
        variant="ghost" 
        className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;

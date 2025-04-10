
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CallsPage from "./pages/CallsPage";
import MessagesPage from "./pages/MessagesPage";
import ContactsPage from "./pages/ContactsPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route 
              path="/calls" 
              element={
                <MainLayout onLogout={handleLogout}>
                  <CallsPage />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/messages" 
              element={
                <MainLayout onLogout={handleLogout}>
                  <MessagesPage />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/contacts" 
              element={
                <MainLayout onLogout={handleLogout}>
                  <ContactsPage />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/history" 
              element={
                <MainLayout onLogout={handleLogout}>
                  <HistoryPage />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <MainLayout onLogout={handleLogout}>
                  <SettingsPage />
                </MainLayout>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Leads from "./pages/Leads";
import ActivityLog from "./pages/ActivityLog";
import ScoringGuide from "./pages/ScoringGuide";
import UploadErrors from "./pages/UploadErrors";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";

const PageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    const getTitle = () => {
      switch (location.pathname) {
        case '/':
          return 'Dashboard - OutboundX';
        case '/leads':
          return 'Leads - OutboundX';
        case '/activity-log':
          return 'Activity Log - OutboundX';
        case '/scoring-guide':
          return 'Scoring Guide - OutboundX';
        case '/upload-errors':
          return 'Upload Errors - OutboundX';
        case '/auth':
          return 'Login - OutboundX';
        default:
          return 'OutboundX';
      }
    };
    
    document.title = getTitle();
  }, [location]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen flex">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full relative">
          <div className="fixed top-0 left-0 h-screen z-50">
            <AppSidebar />
          </div>
          <main className="flex-1 ml-[var(--sidebar-width)] p-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTitle />
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <Leads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity-log"
                element={
                  <ProtectedRoute>
                    <ActivityLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scoring-guide"
                element={
                  <ProtectedRoute>
                    <ScoringGuide />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-errors"
                element={
                  <ProtectedRoute>
                    <UploadErrors />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
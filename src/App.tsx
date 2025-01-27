import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Leads from "./pages/Leads";
import ActivityLog from "./pages/ActivityLog";
import ScoringGuide from "./pages/ScoringGuide";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { cn } from "@/lib/utils";

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
        <ProtectedContent>{children}</ProtectedContent>
      </SidebarProvider>
    </div>
  );
};

const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();

  return (
    <div className="flex w-full relative">
      <div className="fixed top-0 left-0 h-screen z-50">
        <AppSidebar />
      </div>
      <main className={cn(
        "flex-1 p-4 overflow-auto transition-all duration-200",
        state === "collapsed" ? "ml-[var(--sidebar-width-icon)]" : "ml-[var(--sidebar-width)]"
      )}>
        {children}
      </main>
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
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
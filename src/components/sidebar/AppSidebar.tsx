import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SignOut, User } from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useSidebar();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <Sidebar className="h-screen" variant="sidebar">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <SidebarMenuButton
            tooltip="Profile"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <User className="h-4 w-4" />
            <span className={cn(
              "ml-2 transition-all duration-200",
              state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
            )}>
              {user?.email}
            </span>
          </SidebarMenuButton>
          <SidebarMenuButton
            tooltip="Sign Out"
            onClick={handleSignOut}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <SignOut className="h-4 w-4" />
            <span className={cn(
              "ml-2 transition-all duration-200",
              state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
            )}>
              Sign Out
            </span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SignOut, User } from "@phosphor-icons/react";
import { SidebarHeader as Header, SidebarTrigger } from "@/components/ui/sidebar";
import "./SidebarHeader.css";
import "../ComponentsCss/component.css"
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
      
      <div className="flex flex-col gap-2">
          <SidebarMenuButton  
          tooltip="Expand"
          className={cn(
            "flex items-center w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2 cursor-pointer sidebar-collapse",
            state === "collapsed" ? "justify-center" : "justify-start"
          )}>
            <SidebarTrigger className="h-4 w-4 ml-0 sidebar-collapse-button" />
            <span className={cn(
              "transition-all duration-200",
              state === "collapsed" ? "opacity-0 w-0" : "ml-2 opacity-100"
            )}>
              Collapse
            </span>
          </SidebarMenuButton>
        </div>
        <div className="flex flex-col gap-2">
          <SidebarMenuButton
            tooltip="Profile"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <User className="h-4 w-4" />
            <span className={cn(
              "transition-all duration-200",
              state === "collapsed" ? "opacity-0 w-0" : "ml-2 opacity-100"
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
              "transition-all duration-200",
              state === "collapsed" ? "opacity-0 w-0" : "ml-2 opacity-100"
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
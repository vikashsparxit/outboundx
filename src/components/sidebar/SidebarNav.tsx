import {
  LayoutDashboard,
  Table as TableIcon,
  ListChecks,
  Calculator,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: TableIcon,
      label: "Leads",
      path: "/leads",
    },
    {
      icon: ListChecks,
      label: "Activity Log",
      path: "/activity-log",
    },
    {
      icon: Calculator,
      label: "Scoring Guide",
      path: "/scoring-guide",
    },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            tooltip={item.label}
            onClick={() => navigate(item.path)}
            isActive={location.pathname === item.path}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarNav;
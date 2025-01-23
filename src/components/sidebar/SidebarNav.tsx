import {
  Globe,
  ListChecks,
  Calculator,
  LayoutDashboard,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import "./SidebarNav.css";

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
      className: "dashboard-icon",
    },
    {
      icon: Globe,
      label: "Leads",
      path: "/leads",
      className: "globe-icon",
    },
    {
      icon: ListChecks,
      label: "Activity Log",
      path: "/activity-log",
      className: "checklist-icon",
    },
    {
      icon: Calculator,
      label: "Scoring Guide",
      path: "/scoring-guide",
      className: "calculator-icon",
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
            <item.icon className={`h-4 w-4 ${item.className}`} />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarNav;
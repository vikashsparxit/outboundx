import {
  House,
  Globe,
  ListChecks,
  Calculator,
  WarningCircle
} from "@phosphor-icons/react";
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
      icon: House,
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
    {
      icon: WarningCircle,
      label: "Upload Errors",
      path: "/upload-errors",
      className: "warning-icon",
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
            <item.icon 
              className={`h-4 w-4 ${item.className}`}
              weight={location.pathname === item.path ? "fill" : "regular"}
            />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarNav;
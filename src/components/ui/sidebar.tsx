import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const sidebarVariants = cva(
  "group fixed left-0 top-0 z-[9999] flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out data-[expanded=true]:w-64 data-[expanded=false]:w-[60px] data-[variant=floating]:left-2 data-[variant=floating]:top-4 data-[variant=floating]:h-[calc(100vh-2rem)]",
  {
    variants: {
      variant: {
        default: "border-r border-border bg-background",
        floating: "",
        sidebar: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col bg-[#1A1F2C] group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
      className
    )}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

export { sidebarVariants, SidebarContent };

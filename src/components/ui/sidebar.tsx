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

interface SidebarContextValue {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  variant?: "default" | "floating" | "sidebar";
}

const SidebarContext = React.createContext<SidebarContextValue>({
  expanded: true,
  setExpanded: () => null,
  variant: "default",
});

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarProvider = ({ children, defaultOpen = true }: SidebarProviderProps) => {
  const [expanded, setExpanded] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "floating" | "sidebar";
  collapsible?: "icon" | "full" | false;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant = "default", collapsible = false, ...props }, ref) => {
    const { expanded } = useSidebar();

    return (
      <div
        ref={ref}
        data-expanded={expanded}
        data-variant={variant}
        className={cn(sidebarVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

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

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-4 py-2", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  />
));
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarContent,
  SidebarContext,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  sidebarVariants,
  useSidebar,
};
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "floating" | "sidebar";
  collapsible?: "icon" | "full" | false;
}

const SidebarContext = React.createContext<{
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  variant?: "default" | "floating" | "sidebar";
}>({
  expanded: true,
  setExpanded: () => null,
});

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant = "default", collapsible = false, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(true);

    return (
      <SidebarContext.Provider value={{ expanded, setExpanded, variant }}>
        <div
          ref={ref}
          data-expanded={expanded}
          data-variant={variant}
          className={cn(sidebarVariants({ variant }), className)}
          {...props}
        />
      </SidebarContext.Provider>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-b px-6", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-2", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean;
    tooltip?: string;
  }
>(({ className, isActive, tooltip, ...props }, ref) => {
  const { expanded } = React.useContext(SidebarContext);

  return (
    <button
      ref={ref}
      className={cn(
        "group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({ 
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ expanded: isOpen, setExpanded: setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  type SidebarProps,
};
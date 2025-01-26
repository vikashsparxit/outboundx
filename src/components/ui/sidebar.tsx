"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarVariants = cva(
  "group fixed z-30 flex h-screen flex-col transition-transform duration-300",
  {
    variants: {
      variant: {
        default: "inset-y-0 left-0 w-64 -translate-x-full border-r border-sidebar-border bg-sidebar data-[state=open]:translate-x-0",
        floating: "left-4 top-4 h-[calc(100vh-32px)] w-64 -translate-x-full rounded-lg data-[state=open]:translate-x-0",
        sidebar: "inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  variant: "default" | "floating" | "sidebar";
  state: "expanded" | "collapsed";
  setState: (state: "expanded" | "collapsed") => void;
}

const SidebarContext = React.createContext<SidebarContextValue>({
  open: false,
  setOpen: () => undefined,
  variant: "default",
  state: "expanded",
  setState: () => undefined,
});

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarProvider = ({ children, defaultOpen = false }: SidebarProviderProps) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [state, setState] = React.useState<"expanded" | "collapsed">("expanded");

  return (
    <SidebarContext.Provider value={{ open, setOpen, variant: "sidebar", state, setState }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarVariants>
>(({ className, variant = "default", ...props }, ref) => {
  const { open } = useSidebarContext();

  return (
    <>
      <div
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={cn(sidebarVariants({ variant }), className)}
        {...props}
      />
      {open && variant === "default" && (
        <div className="fixed inset-0 z-20 bg-black/80" onClick={() => setOpen(false)} />
      )}
    </>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { variant } = useSidebarContext();

  return (
    <div
      ref={ref}
      data-variant={variant}
      className={cn(
        "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-b border-sidebar-border px-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { setOpen } = useSidebarContext();

  return (
    <button
      ref={ref}
      onClick={() => setOpen(true)}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-2", className)}
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

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

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
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      className
    )}
    {...props}
  />
));
SidebarMenuButton.displayName = "SidebarMenuButton";

function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebarContext,
};
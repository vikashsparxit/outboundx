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
  variant: "default" | "floating";
}

const SidebarContext = React.createContext<SidebarContextValue>({
  open: false,
  setOpen: () => undefined,
  variant: "default",
});

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarVariants>
>(({ className, variant = "default", ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen, variant }}>
      <div
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={cn(sidebarVariants({ variant }), className)}
        {...props}
      />
      {open && variant === "default" && (
        <div className="fixed inset-0 z-20 bg-black/80" onClick={() => setOpen(false)} />
      )}
    </SidebarContext.Provider>
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

const SidebarBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
));
SidebarBody.displayName = "SidebarBody";

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

function useSidebarContext() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useContext must be used within a Provider");
  }

  return context;
}

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarBody,
  SidebarTrigger,
  useSidebarContext,
};
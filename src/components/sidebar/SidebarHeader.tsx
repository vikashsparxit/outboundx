import { SidebarHeader as Header, SidebarTrigger } from "@/components/ui/sidebar";

const SidebarHeader = () => {
  return (
    <Header className="border-b border-border px-4 py-2 mt-[80px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sales Dashboard</h2>
        <SidebarTrigger />
      </div>
    </Header>
  );
};

export default SidebarHeader;
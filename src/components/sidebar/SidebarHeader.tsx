import { SidebarHeader as Header } from "@/components/ui/sidebar";

const SidebarHeader = () => {
  return (
    <Header className="px-4 py-6">
      <h2 className="font-bold text-2xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent tracking-tight">
        OutboundX
      </h2>
    </Header>
  );
};

export default SidebarHeader;
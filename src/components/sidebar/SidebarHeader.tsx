import { SidebarHeader as Header, SidebarTrigger, useSidebarContext } from "@/components/ui/sidebar";

const SidebarHeader = () => {
  const { isOpen } = useSidebarContext();
  
  return (
    <Header className="border-b border-border px-4 py-2 mt-[64px]">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold transition-opacity duration-200 ${!isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
          Sales Dashboard
        </h2>
        <SidebarTrigger />
      </div>
    </Header>
  );
};

export default SidebarHeader;
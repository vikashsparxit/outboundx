import { SidebarHeader as Header, SidebarTrigger, useSidebarContext } from "@/components/ui/sidebar";
import "./SidebarHeader.css";

const SidebarHeader = () => {
  const { state } = useSidebarContext();
  
  return (
    <Header className="border-b border-border px-4 py-2">
      <div className="flex items-center justify-between">
        <h2 
          className={`text-lg font-bold transition-all duration-200 outbound-logo ${
            state === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100'
          }`}
        >
          <span className="text-primary">Outbound</span>
          <span className="text-accent-foreground">X</span>
        </h2>
        <SidebarTrigger />
      </div>
    </Header>
  );
};

export default SidebarHeader;
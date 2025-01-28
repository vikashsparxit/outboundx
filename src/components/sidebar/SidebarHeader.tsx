import { SidebarHeader as Header, useSidebar } from "@/components/ui/sidebar";
import "./SidebarHeader.css";

const SidebarHeader = () => {
  const { state } = useSidebar();
  
  return (
    <Header className="border-b border-border px-4 py-2 mt-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 
            className={`text-lg font-bold transition-all duration-200 outbound-logo ${
              state === 'collapsed' ? 'opacity-0 w-0 hidden' : 'opacity-100'
            }`}
          >
            <span className="text-primary">Outbound</span>
            <span className="text-accent-foreground">X</span>
          </h2>
          <h2 
            className={`text-lg font-bold transition-all duration-200 outbound-logo ${
              state === 'collapsed' ? 'opacity-100' : 'opacity-0 w-0 hidden'
            }`}
          >
            <span className="text-accent-foreground">X</span>
          </h2>
        </div>
      </div>
    </Header>
  );
};

export default SidebarHeader;
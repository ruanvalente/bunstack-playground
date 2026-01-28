
import { useSidebar } from "@shared/hooks/use-sidebar";

export function SidebarRoot({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={`
        bg-gray-800 h-min-full flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {children}
    </aside>
  );
}

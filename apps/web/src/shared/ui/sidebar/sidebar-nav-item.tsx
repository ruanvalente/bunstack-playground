import { Link } from "react-router";
import { useParams } from "react-router";
import { useSidebarStore } from "../../store/sidebar.store";

type SidebarItemProps = {
  label: string;
  icon: string;
  route: string;
};

export function SidebarItem({ label, icon, route }: SidebarItemProps) {
  const params = useParams();
  const isOpen = useSidebarStore((s) => s.isOpen);

  const isActive = params.pathname === route;

  if (!isOpen) {
    return (
      <Link
        to={route}
        title={label}
        className={`flex items-center justify-center p-3 rounded-lg transition
          ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }
        `}
      >
        <span className="text-xl">{icon}</span>
      </Link>
    );
  }

  return (
    <Link
      to={route}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-700"
        }
      `}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

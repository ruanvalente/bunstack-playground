import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SIDEBAR_KEY } from "../../config/constants/storage.config";

type NavItem = {
  label: string;
  icon: string;
  route: string;
}

type SidebarState = {
  isOpen: boolean;
  isMobile: boolean;
  navItems: NavItem[];

  setIsMobile: (value: boolean) => void;
  toggle: () => void;
  setOpen: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isMobile: false,
      navItems: [
        { label: "Dashboard", route: "/dashboard", icon: ''},
        { label: "Tarefas", route: "/tasks", icon: ''},
        { label: "Configurações", route: "/settings", icon: ''},
      ],

      setIsMobile: (mobile: boolean) => set({ isMobile: mobile }),
      setOpen: (open: boolean) => set({ isOpen: open }),
      toggle: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: SIDEBAR_KEY,
      partialize: (state: SidebarState) => ({ isOpen: state.isOpen }),
      // onRehydrateStorage: (state) => {
      //   console.log("Store rehydrated!", state);
      // },
    }
  )
);

import { create } from "zustand";

type User = {
  name: string;
  avatar: string;
};

type HeaderState = {
  title: string;
  showMenu: boolean;
  user: User;

  setTitle: (title: string) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  title: "My System",
  showMenu: false,

  user: {
    name: "Ruan Valente",
    avatar:
      "https://avatars.githubusercontent.com/u/6674232?s=400&u=62eb573c8af66e882bbf633187e0f247714d30ec&v=4",
  },

  setTitle: (title) => set({ title }),
  toggleMenu: () => set((state) => ({ showMenu: !state.showMenu })),
  closeMenu: () => set({ showMenu: false }),
}));

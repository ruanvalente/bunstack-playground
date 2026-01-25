import { useHeaderStore } from "../store/header.store";

export function useHeader() {
  const { title, showMenu, user, toggleMenu, closeMenu } = useHeaderStore();

  return {
    title,
    showMenu,
    user,
    toggleMenu,
    closeMenu,
  };
}

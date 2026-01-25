
import { useEffect } from "react";
import { useSidebarStore } from "../store/sidebar.store";

const MOBILE_BREAKPOINT = "(max-width: 767px)";

export function useSidebar() {
  const { isOpen, isMobile, navItems, setIsMobile, setOpen, toggle } =
    useSidebarStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(MOBILE_BREAKPOINT);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = e.matches;
      setIsMobile(mobile);

      if (mobile) {
        setOpen(false);
      }
    };

    handleChange(mql);

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [setIsMobile, setOpen]);

  return {
    isOpen,
    isMobile,
    navItems,
    toggle,
  };
}

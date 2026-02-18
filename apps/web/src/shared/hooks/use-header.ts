import { useHeaderStore } from "../store/header.store";
import { useAuthStore } from "@features/auth/store/auth.store";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Kingston";
const DEFAULT_NAME = "Usuário";

export function useHeader() {
  const { title, showMenu, toggleMenu, closeMenu } = useHeaderStore();
  const authUser = useAuthStore((state) => state.user) as Record<
    string,
    unknown
  > | null;

  const userMetadata = authUser?.user_metadata as
    | Record<string, unknown>
    | undefined;

  const user = {
    name: (userMetadata?.preferred_username as string) || DEFAULT_NAME,
    avatar: (userMetadata?.avatar_url as string) || DEFAULT_AVATAR,
    email: (authUser?.email as string) || "",
    fullName: (userMetadata?.full_name as string) || DEFAULT_NAME,
  };

  return {
    title,
    showMenu,
    user,
    toggleMenu,
    closeMenu,
  };
}

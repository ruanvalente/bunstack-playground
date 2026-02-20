import { useHeaderStore } from '../store/header.store';
import { useAuthStore } from '@features/auth/store/auth.store';

const DEFAULT_AVATAR =
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Kingston';
const DEFAULT_NAME = 'Usuário';

export function useHeader() {
  const { title, showMenu, toggleMenu, closeMenu } = useHeaderStore();
  const user = useAuthStore((state) => state.user);

  const headerUser = {
    name: user?.preferred_username || user?.name || DEFAULT_NAME,
    avatar: user?.avatar_url || DEFAULT_AVATAR,
    email: user?.email || '',
    fullName: user?.full_name || user?.name || DEFAULT_NAME,
  };

  return {
    title,
    showMenu,
    user: headerUser,
    toggleMenu,
    closeMenu,
  };
}

import { useCurrentUser } from './useCurrentUser';

export interface NavItem {
  label: string;
  value: 'home' | 'schedule' | 'teams' | 'ratings' | 'more' | 'admin';
  icon: string;
  requiredRoles?: string[]; // if undefined, accessible to all
  anyRole?: boolean; // if true, user needs ANY of the requiredRoles; if false, needs ALL
}

const ALL_NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    value: 'home',
    icon: 'home',
    requiredRoles: undefined, // accessible to all
  },
  {
    label: 'Schedule',
    value: 'schedule',
    icon: 'calendar',
    requiredRoles: undefined, // accessible to all
  },
  {
    label: 'Teams',
    value: 'teams',
    icon: 'users',
    requiredRoles: undefined, // accessible to all
  },
  {
    label: 'Standings',
    value: 'ratings',
    icon: 'chart',
    requiredRoles: undefined, // accessible to all
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: 'settings',
    requiredRoles: ['admin'],
    anyRole: false, // must be admin
  },
  {
    label: 'More',
    value: 'more',
    icon: 'menu',
    requiredRoles: undefined, // accessible to all
  },
];

/**
 * Hook that returns filtered navigation items based on user roles
 * Items without requiredRoles are always included
 */
export function useNavigation() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    // Return empty while loading
    return { items: [], loading: true };
  }

  if (!user) {
    // Return only public items for unauthenticated users
    const publicItems = ALL_NAV_ITEMS.filter(item => !item.requiredRoles);
    return { items: publicItems, loading: false };
  }

  // Filter items based on user roles
  const filteredItems = ALL_NAV_ITEMS.filter(item => {
    // No role requirement - always include
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true;
    }

    // anyRole = true means user needs ANY of the roles
    if (item.anyRole !== false) {
      return item.requiredRoles.some(role => user.roles.includes(role as any));
    }

    // anyRole = false means user needs ALL roles
    return item.requiredRoles.every(role => user.roles.includes(role as any));
  });

  return { items: filteredItems, loading: false };
}

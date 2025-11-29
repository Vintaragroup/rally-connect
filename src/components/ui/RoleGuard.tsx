import { ReactNode } from 'react';
import { useCurrentUser, UserRole } from '../../hooks/useCurrentUser';

interface RoleGuardProps {
  /**
   * User must have ANY of these roles (OR logic)
   */
  anyOf?: UserRole[];
  /**
   * User must have ALL of these roles (AND logic)
   */
  allOf?: UserRole[];
  /**
   * Content to render if user has required roles
   */
  children: ReactNode;
  /**
   * Content to render if user doesn't have required roles
   * Defaults to null (renders nothing)
   */
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user roles
 * 
 * Examples:
 * - <RoleGuard anyOf={['admin']}>Admin content</RoleGuard>
 * - <RoleGuard allOf={['captain', 'player']}>Must be both captain and player</RoleGuard>
 * - <RoleGuard anyOf={['admin', 'captain']} fallback={<p>Not authorized</p>}>Admin or captain content</RoleGuard>
 */
export function RoleGuard({ 
  anyOf, 
  allOf, 
  children, 
  fallback = null 
}: RoleGuardProps) {
  const { user, loading } = useCurrentUser();

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // No user - deny access
  if (!user) {
    return fallback;
  }

  // Check anyOf condition (user must have at least one role)
  if (anyOf && anyOf.length > 0) {
    const hasAnyRole = anyOf.some(role => user.roles.includes(role));
    if (!hasAnyRole) {
      return fallback;
    }
  }

  // Check allOf condition (user must have all roles)
  if (allOf && allOf.length > 0) {
    const hasAllRoles = allOf.every(role => user.roles.includes(role));
    if (!hasAllRoles) {
      return fallback;
    }
  }

  // User passes all role checks
  return children;
}

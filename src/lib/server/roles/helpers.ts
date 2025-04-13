import type { RoleType } from '../../shared/const/roles';

export function hasRole(userRoles: string[], role: RoleType): boolean {
	return userRoles.includes(role);
}

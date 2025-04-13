import { MESSAGES } from '$lib/shared/messages/messages';
import { ROLES } from '../../shared/const/roles';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getUserRoles(supabase: SupabaseClient, userId: string): Promise<string[]> {
	const { data, error } = await supabase
		.from('user_roles')
		.select('roles(role)')
		.eq('user_id', userId) as {
			data: { roles: { role: string }[] | null }[] | null;
			error: Error | null;
		};

	if (error || !data) {
		throw new Error(MESSAGES.roles.failed_to_fetch);
	}

	return data
		.flatMap((row) => row.roles ?? [])
		.map((r) => r.role);
}

export async function assignUserRole(
	supabase: SupabaseClient,
	userId: string,
	role = ROLES.USER
): Promise<void> {
	const { data: roleRow } = await supabase
		.from('roles')
		.select('id')
		.eq('role', role)
		.single();

	if (!roleRow) { 
		throw new Error(MESSAGES.roles.role_not_found(role));
	}

	const role_id = roleRow.id;

	const { data: existing } = await supabase
		.from('user_roles')
		.select('id')
		.eq('user_id', userId)
		.eq('role_id', role_id)
		.maybeSingle();

	if (!existing) {
		await supabase.from('user_roles').insert({ user_id: userId, role_id });
	}
}

export async function toggleAdminRole(supabase: SupabaseClient, userId: string) {
	const { data: adminRole, error: roleErr } = await supabase
		.from('roles')
		.select('id')
		.eq('role', ROLES.ADMIN)
		.maybeSingle();

	if (roleErr || !adminRole) throw new Error(MESSAGES.roles.role_not_found(ROLES.ADMIN));

	const role_id = adminRole.id;

	const { data: existing } = await supabase
		.from('user_roles')
		.select('id')
		.eq('user_id', userId)
		.eq('role_id', role_id)
		.maybeSingle();

	if (existing) {
		await supabase.from('user_roles').delete().eq('id', existing.id);
		return MESSAGES.roles.role_removed(ROLES.ADMIN);
	} 
    else {
		await supabase.from('user_roles').insert({ user_id: userId, role_id });
		return MESSAGES.roles.role_assigned(ROLES.ADMIN);
	}
}

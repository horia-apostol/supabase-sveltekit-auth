import type { SupabaseClient } from '@supabase/supabase-js';
import { ROLES } from '$lib/shared/const/roles';
import { MESSAGES } from '$lib/shared/messages/messages';

export async function fetchUserEntries(
	supabase: SupabaseClient,
	userId: string
) {
	const { data, error } = await supabase
		.from('entries')
		.select('id, name, created_at_utc')
		.eq('user_id', userId)
		.order('created_at_utc', { ascending: false });

	if (error) throw new Error(error.message);
	return data ?? [];
}

export async function insertUserEntry(
	supabase: SupabaseClient,
	userId: string,
	name: string
) {
	const { error } = await supabase
		.from('entries')
		.insert({ name, user_id: userId });

	if (error) throw new Error(error.message);
}

export async function deleteEntryIfAdmin(
	supabase: SupabaseClient,
	userId: string,
	entryId: string
): Promise<void> {
	const { data: roles, error: rolesError } = await supabase
		.from('user_roles')
		.select('roles(role)')
		.eq('user_id', userId) as {
			data: { roles: { role: string } | null }[] | null;
			error: Error | null;
		};

	if (rolesError || !roles) {
		throw new Error(MESSAGES.roles.failed_to_fetch);
	}

	const isAdmin = roles.some((r) => r.roles?.role === ROLES.ADMIN);

	if (!isAdmin) { 
		throw new Error(MESSAGES.entries.forbidden);
	}

	const { error: deleteError } = await supabase
		.from('entries')
		.delete()
		.eq('id', entryId);

	if (deleteError) { 
		throw new Error(deleteError.message);
	}
}

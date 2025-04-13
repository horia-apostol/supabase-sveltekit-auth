import { MESSAGES } from '$lib/shared/messages/messages';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getUserProfile(supabase: SupabaseClient, userId: string) {
	const { data, error } = await supabase
		.from('profiles')
		.select('first_name, last_name')
		.eq('user_id', userId)
		.single();

	if (error || !data) {
		throw new Error(MESSAGES.profile.not_found);
	}

	return data;
}

export async function createUserProfile(
	supabase: SupabaseClient,
	userId: string,
	first_name: string,
	last_name: string
): Promise<void> {
	const { data: existingProfile } = await supabase
		.from('profiles')
		.select('user_id')
		.eq('user_id', userId)
		.maybeSingle();

	if (!existingProfile) {
		await supabase
			.from('profiles')
			.insert({ user_id: userId, first_name, last_name });
	}
}

export async function updateUserProfile(
	supabase: SupabaseClient,
	userId: string,
	first_name: string,
	last_name: string
): Promise<void> {
	const { error } = await supabase
		.from('profiles')
		.update({
			first_name,
			last_name,
			updated_at_utc: new Date().toISOString()
		})
		.eq('user_id', userId);

	if (error) { 
		throw new Error(error.message);
	}
}


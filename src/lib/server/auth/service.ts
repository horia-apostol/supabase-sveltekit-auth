import { MESSAGES } from '$lib/shared/messages/messages';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function loginWithEmailPassword(
	supabase: SupabaseClient,
	email: string,
	password: string
) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });

	if (error || !data.session || !data.user) {
		throw new Error(MESSAGES.auth.invalid_credentials);
	}

	return data;
}

export async function signUpUser(
	supabase: SupabaseClient,
	email: string,
	password: string,
	first_name: string,
	last_name: string,
	redirectUrl: string
) {
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { first_name, last_name },
			emailRedirectTo: redirectUrl
		}
	});

	if (error) {
		throw new Error(error.message);
	}
}
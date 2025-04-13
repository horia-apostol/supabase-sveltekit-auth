import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createUserProfile } from '$lib/server/profiles/services';
import { assignUserRole } from '$lib/server/roles/services';
import { MESSAGES } from '$lib/shared/messages/messages';
import { HTTP } from '$lib/server/http';

const EMAIL = 'email';
const PASSWORD = 'password';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get(EMAIL) as string;
		const password = formData.get(PASSWORD) as string;

		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error || !data?.user || !data?.session) {
			console.error(MESSAGES.auth.login_error, " ", error?.message);
			return fail(HTTP.status.NOT_FOUND, { message: MESSAGES.auth.invalid_credentials });
		}

		const user = data.user;
		const { id, user_metadata } = user;
		const first_name = user_metadata.first_name;
		const last_name = user_metadata.last_name;

		try {
			await createUserProfile(locals.supabase, id, first_name, last_name);
			await assignUserRole(locals.supabase, id);
		} catch (e: any) {
			console.error(MESSAGES.auth.login_error, " ", e.message);
			return fail(HTTP.status.NOT_FOUND, { message: MESSAGES.auth.setup_error });
		}

		throw redirect(303, '/dashboard');
	}
};

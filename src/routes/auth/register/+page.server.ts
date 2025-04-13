import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signUpUser } from '$lib/server/auth/service';
import { MESSAGES } from '$lib/shared/messages/messages';

const EMAIL = 'email';
const PASSWORD = 'password';
const FIRST_NAME = 'first_name';
const LAST_NAME = 'last_name';

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();

		const email = formData.get(EMAIL) as string;
		const password = formData.get(PASSWORD) as string;
		const first_name = formData.get(FIRST_NAME) as string;
		const last_name = formData.get(LAST_NAME) as string;

		try {
			await signUpUser(
				locals.supabase,
				email,
				password,
				first_name,
				last_name,
				`${url.origin}/auth/confirm`
			);

			return { message: MESSAGES.auth.register_success };
		} 
		catch (err: any) {
			console.error(MESSAGES.auth.register_error, " ", err);
			return fail(400, { message: MESSAGES.auth.register_failed });
		}
	}
};

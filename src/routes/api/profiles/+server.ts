import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateNameField } from '$lib/server/profiles/helpers';
import { updateUserProfile } from '$lib/server/profiles/services';
import { HTTP } from '$lib/server/http';
import { MESSAGES } from '$lib/shared/messages/messages';

const FIRST_NAME = "First name";
const LAST_NAME = "Last name";

export const PUT: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: MESSAGES.auth.unauthorized }, { status: HTTP.status.UNAUTHORIZED });
	}

	const { first_name, last_name } = await request.json();

	const firstErr = validateNameField(first_name, FIRST_NAME);
	const lastErr = validateNameField(last_name, LAST_NAME);

	if (firstErr || lastErr) {
		return json({ error: firstErr || lastErr }, { status: HTTP.status.BAD_REQUEST });
	}

	try {
		await updateUserProfile(locals.supabase, locals.user.id, first_name, last_name);
		return json({ message: MESSAGES.profile.updated }, { status: HTTP.status.OK });
	} 
  	catch (err: any) {
		return json({ error: err.message }, { status: HTTP.status.SERVER_ERROR });
	}
};

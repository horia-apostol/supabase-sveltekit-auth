import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { HTTP } from '$lib/server/http';
import { getUserProfile } from '$lib/server/profiles/services';
import { AUTH_HEADER_NAME, AUTH_HEADER_PREFIX } from '$lib/shared/const/auth';
import { MESSAGES } from '$lib/shared/messages/messages';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get(AUTH_HEADER_NAME);
	const token = authHeader?.replace(AUTH_HEADER_PREFIX, '');

	if (!token) {
		return json(
			{ error: MESSAGES.token.missing_or_invalid }, 
			{ status: HTTP.status.UNAUTHORIZED }
		);
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			headers: { Authorization: `${AUTH_HEADER_PREFIX}${token}` }
		}
	});

	const { data: { user }, error: userError } = await supabase.auth.getUser();

	if (userError || !user) {
		return json({ error: MESSAGES.token.invalid_or_user_not_found }, { status: HTTP.status.UNAUTHORIZED });
	}

	try {
		const profile = await getUserProfile(supabase, user.id);
		return json(
			{ message: MESSAGES.bearer.authenticated(profile.first_name, profile.last_name) },
			{ status: HTTP.status.OK }
		);
	} 
  	catch (err: any) {
		return json({ error: err.message }, { status: HTTP.status.NOT_FOUND });
	}
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { HTTP } from '$lib/server/http';
import { getUserRoles, toggleAdminRole } from '$lib/server/roles/services';
import { MESSAGES } from '$lib/shared/messages/messages';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ roles: [] }, { status: HTTP.status.UNAUTHORIZED });
	}

	try {
		const roles = await getUserRoles(locals.supabase, locals.user.id);
		return json({ roles }, { status: HTTP.status.OK });
	} 
  	catch {
		return json({ roles: [] }, { status: HTTP.status.SERVER_ERROR });
	}
};

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response(MESSAGES.auth.unauthorized, { status: HTTP.status.UNAUTHORIZED });
	}

	try {
		const message = await toggleAdminRole(locals.supabase, locals.user.id);
		return json({ message }, { status: HTTP.status.OK });
	} 
  	catch (err: any) {
		return json({ error: err.message }, { status: HTTP.status.SERVER_ERROR });
	}
};

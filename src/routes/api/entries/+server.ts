import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { HTTP } from '$lib/server/http';
import { validateEntryName } from '$lib/server/entries/helpers';
import { fetchUserEntries, insertUserEntry, deleteEntryIfAdmin } from '$lib/server/entries/services';
import { MESSAGES } from '$lib/shared/messages/messages';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response(MESSAGES.auth.unauthorized, { status: HTTP.status.UNAUTHORIZED });
	}

	try {
		const data = await fetchUserEntries(locals.supabase, locals.user.id);
		return json({ entries: data }, { status: HTTP.status.OK });
	} 
	catch (err: any) {
		return json({ error: err.message }, { status: HTTP.status.SERVER_ERROR });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response(MESSAGES.auth.unauthorized, { status: HTTP.status.UNAUTHORIZED });
	}

	const { name } = await request.json();
	const validationError = validateEntryName(name);

	if (validationError) {
		return json({ error: validationError }, { status: HTTP.status.BAD_REQUEST });
	}

	try {
		await insertUserEntry(locals.supabase, locals.user.id, name);
		return json (
			{ message: MESSAGES.entries.added }, 
			{ status: HTTP.status.CREATED }
		);
	} 
  	catch (err: any) {
		return json ( 
			{ error: err.message }, 
			{ status: HTTP.status.SERVER_ERROR }
		);
	}
};

export const DELETE: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		return new Response(MESSAGES.auth.unauthorized, { status: HTTP.status.UNAUTHORIZED });
	}

	const id = url.searchParams.get('id');
	if (!id) {
		return new Response(MESSAGES.entries.missing_id, { status: HTTP.status.BAD_REQUEST });
	}

	try {
		await deleteEntryIfAdmin(locals.supabase, locals.user.id, id);
		return new Response(MESSAGES.entries.deleted, { status: HTTP.status.OK });
	} 
  	catch (err: any) {
		const status =
			err.message === MESSAGES.entries.forbidden
				? HTTP.status.FORBIDDEN
				: HTTP.status.SERVER_ERROR;
		return json({ error: err.message }, { status });
	}
};

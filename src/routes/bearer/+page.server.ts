import { AUTH_HEADER_PREFIX } from '$lib/shared/const/auth';
import { MESSAGES } from '$lib/shared/messages/messages';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
	const token = locals.session?.access_token;

	const res = await fetch(`${url.origin}/api/bearer`, {
		headers: {
			Authorization: `${AUTH_HEADER_PREFIX}${token}`
		}
	});

	const json = await res.json();

	return {
		message: json.message ?? json.error ?? MESSAGES.unexpected.error
	};
};

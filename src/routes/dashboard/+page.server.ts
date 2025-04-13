import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserProfile } from '$lib/server/profiles/services';
import { getUserRoles } from '$lib/server/roles/services';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	const userId = locals.user.id;

	const [profile, roles] = await Promise.all([
		getUserProfile(locals.supabase, userId),
		getUserRoles(locals.supabase, userId)
	]);

	return {
		id: userId,
		profile,
		roles
	};
};

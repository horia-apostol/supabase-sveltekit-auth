import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	return {
		confirmed: url.searchParams.get('confirmed') === 'true'
	};
};
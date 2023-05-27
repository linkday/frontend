export const prerender = false;

export const load = async ({ locals }) => {
	return {
		user: locals.user,
	};
};

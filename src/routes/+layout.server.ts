export const load = async ({ locals, cookies }) => {
	return {
		user: locals.user,
		session: cookies.get("LINKDAY"),
	};
};

export const prerender = false;

export const load = async ({ cookies }) => {
	cookies.set("LINKDAY", "");
};

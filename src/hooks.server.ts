import { redirect, type Handle } from "@sveltejs/kit";
import { api } from "./api";

export const handle = (async ({ event, resolve }) => {
	const session = event.cookies.get("LINKDAY");

	console.log("session", session);
	console.log("event.url", event.url.pathname);

	if (!session) {
		event.locals.user = undefined;

		if (event.url.pathname === "/" || event.url.pathname === "/login") {
			return await resolve(event);
		}

		throw redirect(303, "/");
	}

	if (!event.locals.user) {
		try {
			const user = await api.getCurrentUser({
				headers: {
					Cookie: `LINKDAY=${session}`,
				},
			});
			event.locals.user = user.data;
		} catch (error) {
			console.log("error", error);

			event.cookies.set("LINKDAY", "", {
				domain: ".linkday.ez4o.com",
				maxAge: -1,
			});
		}
	}

	return await resolve(event);
}) satisfies Handle;

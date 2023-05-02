import { redirect, type Handle } from "@sveltejs/kit";
import { api } from "./api";

export const handle = (async ({ event, resolve }) => {
	const session = event.cookies.get("LINKDAY");

	console.log("session", session);
	console.log("event.url", event.url.pathname);

	if (!session) {
		if (event.url.pathname === "/") {
			return await resolve(event);
		}

		throw redirect(303, "/");
	}

	if (!event.locals.user) {
		try {
			event.locals.user = await api.getCurrentUser();
		} catch (error) {
			console.log("error", error);
			throw redirect(303, "/");
		}
	}

	return await resolve(event);
}) satisfies Handle;

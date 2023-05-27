import { redirect } from "@sveltejs/kit";
import { api } from "../../api/index.js";

export const load = async ({ cookies }) => {
	if (!cookies.get("LINKDAY")) {
		throw redirect(303, "/");
	}

	await api
		.logout(undefined, {
			headers: {
				Cookie: `LINKDAY=${cookies.get("LINKDAY")}`,
			},
		})
		.then(() => {
			cookies.set("LINKDAY", "");
			throw redirect(303, "/");
		});
};

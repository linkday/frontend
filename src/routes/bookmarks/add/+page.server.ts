import { superValidate } from "sveltekit-superforms/server";
import { schemas } from "../../../api/api.gen";
import { api } from "../../../api";
import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
	if (!cookies.get("LINKDAY")) {
		throw redirect(303, "/");
	}

	const form = await superValidate(schemas.BookmarkPayload);
	const tags = await api.getTags({
		headers: {
			Cookie: `LINKDAY=${cookies.get("LINKDAY")}`,
		},
	});

	return {
		form,
		tags,
	};
};

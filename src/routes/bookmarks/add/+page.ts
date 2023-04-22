import { superValidate } from "sveltekit-superforms/server";
import { schemas } from "../../../api/api.client";
import { api } from "../../../api";

export const load = async () => {
	const form = await superValidate(schemas.BookmarkPayload);
	const tags = await api.getTags();

	return {
		form,
		tags,
	};
};

import { api } from "../hook.client";
import type { PageLoad } from "./$types";

export const load = (async () => {
	const tagsBookmarks = await api.getUserTags({
		params: {
			userId: "1",
		},
	});

	return {
		tagsBookmarks,
	};
}) satisfies PageLoad;

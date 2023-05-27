import { redirect } from "@sveltejs/kit";
import { api } from "../../api";
import type { FeedsResponse } from "../../api/api.gen";

export const load = async ({ cookies }) => {
	if (!cookies.get("LINKDAY")) {
		throw redirect(303, "/");
	}

	let feeds: FeedsResponse = {
		data: [],
	};

	try {
		feeds = await api.getFeeds({
			headers: {
				Cookie: `LINKDAY=${cookies.get("LINKDAY")}`,
			},
		});
	} catch (err) {
		console.log(err);
	}

	return { feeds };
};

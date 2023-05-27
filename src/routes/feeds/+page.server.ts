import { redirect } from "@sveltejs/kit";
import { api } from "../../api";
import { schemas, type FeedsResponse } from "../../api/api.gen";
import { ZodiosError } from "@zodios/core";

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
		if (err instanceof ZodiosError) {
			feeds = err.data as FeedsResponse;

			if (feeds.data === null) {
				feeds.data = [];
			}

			feeds.data = feeds.data.filter((feed) => schemas.Feed.safeParse(feed).success);
		}

		console.log(err);
	}

	return { feeds };
};

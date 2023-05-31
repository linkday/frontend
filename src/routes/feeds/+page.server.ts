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

	// result is unstable sort
	// alphabetical sort to make it stable
	feeds.data = feeds.data.sort((a, b) => {
		return a.title.localeCompare(b.title);
	});

	// then sort by date
	feeds.data = feeds.data.sort((a, b) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});

	return { feeds };
};

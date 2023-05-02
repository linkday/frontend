import { redirect } from "@sveltejs/kit";
import { api } from "../../api";
import type { BookmarksResponse } from "../../api/api.client";

export const load = async ({ locals, cookies }) => {
	if (!cookies.get("LINKDAY")) {
		throw redirect(303, "/");
	}

	let bookmarks: BookmarksResponse = {
		data: [],
	};

	try {
		bookmarks = await api.getUserBookmarks({
			params: {
				userId: locals.user?.id ?? "",
			},
			headers: {
				Cookie: `LINKDAY=${cookies.get("LINKDAY")}`,
			},
		});

		// TODO: this is a workaround for mock server, remove it when real server is ready
		for (let i = 0; i < bookmarks.data.length; i++) {
			bookmarks.data[i].tags = bookmarks.data[i].tags.map((tag) => ({
				...tag,
				name: tag.name.substring(0, 5),
			}));
			bookmarks.data[i].thumbnail_url = "https://source.unsplash.com/featured/200x200";
		}
	} catch (err) {
		console.log(err);
	}

	return { bookmarks };
};

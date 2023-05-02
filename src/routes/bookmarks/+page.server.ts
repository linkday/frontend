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
	} catch (err) {
		console.log(err);
	}

	return { bookmarks };
};

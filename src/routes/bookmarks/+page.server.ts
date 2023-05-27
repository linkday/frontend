import { redirect } from "@sveltejs/kit";
import { api } from "../../api";
import { schemas, type BookmarksResponse } from "../../api/api.gen";
import { ZodiosError } from "@zodios/core";

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
		if (err instanceof ZodiosError) {
			bookmarks = err.data as BookmarksResponse;
			bookmarks.data = bookmarks.data.filter(
				(bookmark) => schemas.Bookmark.safeParse(bookmark).success,
			);
		}

		if (bookmarks.data === null) {
			bookmarks.data = [];
		}

		console.log(err);
	}

	bookmarks.data = bookmarks.data.sort((a, b) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});

	return { bookmarks };
};

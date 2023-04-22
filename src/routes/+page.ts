import { generateMock } from "@anatine/zod-mock";
import { schemas } from "../api/api";

export const load = async () => {
	const bookmarks = generateMock(schemas.BookmarksResponse, {
		stringMap: {
			thumbnail_url: () => "https://source.unsplash.com/featured/200x200",
			description: () =>
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima amet, accusamus omnis similique recusandae pariatur quia at soluta explicabo nesciunt animi expedita in deleniti itaque facere ut assumenda quaerat nihil.",
		},
	});

	return { bookmarks };
};

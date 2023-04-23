import { api } from "../api";

export const prerender = true;

export const load = async () => {
	const bookmarks = await api.getUserBookmarks({
		params: {
			userId: "1",
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

	return { bookmarks };
};

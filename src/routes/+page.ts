import type { PageLoad } from "./$types";

export const load = (async () => {
	// const tagsBookmarks = await api.getUserTags({
	// 	params: {
	// 		userId: "1",
	// 	},
	// });

	return {
		tagsBookmarks: {
			data: [
				{
					id: 0,
					name: "tag1",
					bookmarks: [
						{
							id: 0,
							url: "https://www.google.com/",
							title: "Lorem Ipsum",
							description:
								"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
							thumbnail_url: "https://source.unsplash.com/featured/200x200",
							user_id: 0,
							tag_ids: [0],
							created_at: new Date("2015-07-20T22:49:04.000Z"),
							deleted_at: new Date("2015-07-20T22:49:04.000Z"),
						},
						{
							id: 1,
							url: "https://www.google.com/",
							title: "Lorem Ipsum",
							description:
								"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
							thumbnail_url: "https://source.unsplash.com/featured/200x200",
							user_id: 0,
							tag_ids: [0],
							created_at: new Date("2015-07-20T22:49:04.000Z"),
							deleted_at: new Date("2015-07-20T22:49:04.000Z"),
						},
						{
							id: 2,
							url: "https://www.google.com/",
							title: "Lorem Ipsum",
							description:
								"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
							thumbnail_url: "https://source.unsplash.com/featured/200x200",
							user_id: 0,
							tag_ids: [0],
							created_at: new Date("2015-07-20T22:49:04.000Z"),
							deleted_at: new Date("2015-07-20T22:49:04.000Z"),
						},
					],
				},
				{
					id: 1,
					name: "tag2",
					bookmarks: [
						{
							id: 4,
							url: "https://www.google.com/",
							title: "Lorem Ipsum",
							description:
								"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
							thumbnail_url: "https://source.unsplash.com/featured/200x200",
							user_id: 0,
							tag_ids: [0],
							created_at: new Date("2015-07-20T22:49:04.000Z"),
							deleted_at: new Date("2015-07-20T22:49:04.000Z"),
						},
					],
				},
			],
		},
	};
}) satisfies PageLoad;

<script lang="ts">
	import type { types } from "../api/api";

	export let bookmark: types["Bookmark"];
</script>

<div class="bg-white rounded-lg shadow-lg">
	<div class="flex flex-row">
		<img
			src="https://via.placeholder.com/150"
			alt={bookmark.thumbnail_url}
			class="h-full rounded-l-lg"
		/>
		<div class="flex flex-col p-4 gap-2 pt-6">
			<div class="font-bold text-2xl">{bookmark.title}</div>
			<div class="text-sm text-gray-400 line-clamp-3">
				{bookmark.description +
					" Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
			</div>
		</div>
	</div>
</div>

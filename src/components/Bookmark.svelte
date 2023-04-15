<script lang="ts">
	import type { types } from "../api/api";

	export let bookmark: types["Bookmark"];
</script>

<div
	class="bg-white rounded-lg shadow-lg sm:h-48 h-[22.5rem] cursor-pointer duration-500 ease-in-out hover:shadow-2xl"
	on:click={() => {
		window.open(bookmark.url, "_blank");
	}}
	on:keypress={(e) => {
		if (e.key === "Enter") {
			window.open(bookmark.url, "_blank");
		}
	}}
>
	<div class="flex sm:flex-row flex-col">
		<div class="h-48 aspect-square sm:rounded-l-lg !sm:rounded-t-lg bg-gray-300">
			<img
				src={bookmark.thumbnail_url}
				alt={bookmark.thumbnail_url}
				class="h-48 w-48 sm:rounded-l-lg !sm:rounded-t-lg object-cover"
			/>
		</div>
		<div class="flex flex-col p-6 gap-2 sm:pt-8">
			<div class="font-bold text-2xl line-clamp-1">{bookmark.title}</div>
			<div class="text-gray-400 line-clamp-3">
				{bookmark.description}
			</div>
		</div>
	</div>
</div>

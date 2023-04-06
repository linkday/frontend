<script lang="ts">
	import Bookmark from "../components/Bookmark.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="w-[92%] mx-auto my-2">
	{#each data.tagsBookmarks.data as tag}
		<div class="bg-gray-100 flex flex-col rounded-lg p-4 gap-4">
			<div class="text-lg font-[500] italic bg-white w-min px-4 py-2 shadow-sm rounded-lg">
				#{tag.name}
			</div>
			<div class="flex flex-col gap-4">
				{#each tag.bookmarks as bookmark}
					<Bookmark {bookmark} />
				{/each}
			</div>
		</div>
	{/each}
</div>

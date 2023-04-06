<script lang="ts">
	import Bookmark from "../components/Bookmark.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	let selectedTagIds: number[] = [0];

	$: currentBookmarks = data.tagsBookmarks.data
		.map((tag) => {
			if (selectedTagIds.includes(tag.id)) {
				return tag.bookmarks;
			}
			return [];
		})
		.flat();
</script>

<div class="w-[92%] md:w-1/2 mx-auto my-2">
	<div class=" bg-gray-100 flex flex-col rounded-lg p-6 mb-6 gap-6">
		<div class=" flex flex-row gap-4">
			{#each data.tagsBookmarks.data as tag (tag.id)}
				<div
					class="text-lg font-[500] italic w-min px-4 py-2 shadow-sm rounded-lg whitespace-nowrap"
					class:bg-[#a6c1ee]={selectedTagIds.includes(tag.id)}
					class:bg-white={!selectedTagIds.includes(tag.id)}
					class:text-white={selectedTagIds.includes(tag.id)}
					on:click={() => {
						if (selectedTagIds.includes(tag.id)) {
							selectedTagIds = selectedTagIds.filter((id) => id !== tag.id);
						} else {
							selectedTagIds = [...selectedTagIds, tag.id];
						}
					}}
					on:keypress={(e) => {
						if (e.key === "Enter") {
							if (selectedTagIds.includes(tag.id)) {
								selectedTagIds = selectedTagIds.filter((id) => id !== tag.id);
							} else {
								selectedTagIds = [...selectedTagIds, tag.id];
							}
						}
					}}
				>
					# {tag.name}
				</div>
			{/each}
		</div>
		{#each currentBookmarks as bookmark}
			<Bookmark {bookmark} />
		{/each}
	</div>
</div>

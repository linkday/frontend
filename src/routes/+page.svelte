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

	let tags: HTMLDivElement;
</script>

<div class="w-[92%] lg:w-1/2 mx-auto my-2 flex flex-col h-[calc(100vh-6rem)]">
	<div class="bg-gray-100 flex flex-row rounded-lg px-6 mb-4 gap-6 items-center">
		<button
			class="w-10 h-10 relative focus:outline-none"
			on:click={() => {
				tags.scrollLeft -= 200;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<div class="flex flex-row gap-4 overflow-hidden bg-gray-200 p-4" bind:this={tags}>
			{#each data.tagsBookmarks.data as tag (tag.id)}
				<div
					class="duration-150 ease-in-out text-lg font-[500] italic w-min px-4 py-2 shadow-sm rounded-lg whitespace-nowrap cursor-pointer"
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
		<button
			class="w-10 h-10 relative focus:outline-none"
			on:click={() => {
				tags.scrollLeft += 200;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
	<div class=" bg-gray-100 flex flex-col rounded-lg p-6 mb-4 gap-6 grow">
		{#each currentBookmarks as bookmark}
			<Bookmark {bookmark} />
		{:else}
			<div
				class="h-full text-lg font-[500] italic text-center text-gray-400 flex justify-center items-center"
			>
				No bookmarks found in selected tags.
			</div>
		{/each}
	</div>
</div>

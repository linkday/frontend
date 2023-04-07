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

<div class="w-[92%] mx-auto my-2 flex lg:flex-row flex-col">
	<div class="hidden lg:block mt-12 w-1/4">
		<div class="relative">
			<div class="font-bold text-gray-500 relative mb-4 left-8">TAGS</div>
			{#each data.tagsBookmarks.data as tag (tag.id)}
				<div class="flex flex-row">
					<button class="absolute">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5 relative left-0 top-[2px]"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M13.75 5C13.75 5.9665 12.9665 6.75 12 6.75C11.0335 6.75 10.25 5.9665 10.25 5C10.25 4.0335 11.0335 3.25 12 3.25C12.9665 3.25 13.75 4.0335 13.75 5ZM13.75 19C13.75 19.9665 12.9665 20.75 12 20.75C11.0335 20.75 10.25 19.9665 10.25 19C10.25 18.0335 11.0335 17.25 12 17.25C12.9665 17.25 13.75 18.0335 13.75 19ZM12 13.75C12.9665 13.75 13.75 12.9665 13.75 12C13.75 11.0335 12.9665 10.25 12 10.25C11.0335 10.25 10.25 11.0335 10.25 12C10.25 12.9665 11.0335 13.75 12 13.75Z"
								fill="#000000"
							/>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5 absolute left-[6px] top-[2px]"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M13.75 5C13.75 5.9665 12.9665 6.75 12 6.75C11.0335 6.75 10.25 5.9665 10.25 5C10.25 4.0335 11.0335 3.25 12 3.25C12.9665 3.25 13.75 4.0335 13.75 5ZM13.75 19C13.75 19.9665 12.9665 20.75 12 20.75C11.0335 20.75 10.25 19.9665 10.25 19C10.25 18.0335 11.0335 17.25 12 17.25C12.9665 17.25 13.75 18.0335 13.75 19ZM12 13.75C12.9665 13.75 13.75 12.9665 13.75 12C13.75 11.0335 12.9665 10.25 12 10.25C11.0335 10.25 10.25 11.0335 10.25 12C10.25 12.9665 11.0335 13.75 12 13.75Z"
								fill="#000000"
							/>
						</svg>
					</button>
					<label class="flex items-center gap-4 mb-2 relative left-8">
						<input
							type="checkbox"
							bind:group={selectedTagIds}
							value={tag.id}
							class="form-checkbox h-5 w-5 border-gray-300 rounded checked:accent-[#87acec]"
						/>
						<span class="text-gray-700 italic truncate w-24"># {tag.name}</span>
					</label>
				</div>
			{/each}
		</div>
	</div>
	<div class="lg:w-1/2 w-full flex lg:min-h-[calc(100vh-6rem)] !lg:h-[calc(100vh-6rem)] flex-col">
		<div class="lg:hidden bg-gray-100 flex flex-row rounded-lg px-6 mb-4 gap-6 items-center">
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
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<div
				class="grow flex flex-row gap-4 sm:overflow-hidden overflow-y-scroll bg-gray-200 p-4"
				bind:this={tags}
			>
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
</div>

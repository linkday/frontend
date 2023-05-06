<script lang="ts">
	import Bookmark from "../../components/Bookmark.svelte";
	import { createDialog } from "svelte-headlessui";
	import Transition from "svelte-transition";

	export let data;
	const filterPanel = createDialog({ label: "filter-panel" });

	let searchString = "";
	let filterTags: string[] = [];
	$: filteredBookmarks = data.bookmarks.data
		.filter((bookmark) => bookmark.title.toLowerCase().includes(searchString.toLowerCase()))
		.filter((bookmark) => {
			if (filterTags.length === 0) return true;
			return filterTags.every((tag) => bookmark.tags.map((t) => t.name).includes(tag));
		});

	$: allTags = data.bookmarks.data
		.map((bookmark) => bookmark.tags)
		.flat()
		// TODO: use id instead of name (this is a workaround for mock server)
		.filter((tag, index, self) => self.findIndex((t) => t.name === tag.name) === index);

	$: possibleTagNames = filteredBookmarks
		.map((bookmark) => bookmark.tags)
		.flat()
		.filter((tag, index, self) => self.indexOf(tag) === index)
		.map((tag) => tag.name);

	function toggleTag(tag: string) {
		if (filterTags.includes(tag)) {
			filterTags = filterTags.filter((t) => t !== tag);
		} else {
			filterTags = [...filterTags, tag];
		}
	}
</script>

<svelte:head>
	<title>Linkday - Bookmarks</title>
	<meta name="description" content="The personal bookmark page of linkday app." />
</svelte:head>

<div class="relative z-50">
	<Transition show={$filterPanel.expanded}>
		<Transition
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<button class="fixed inset-0 bg-black bg-opacity-25" on:click={filterPanel.close} />
		</Transition>

		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-6"
						use:filterPanel.modal
					>
						<div class="flex flex-row justify-between">
							<h3 class="text-lg font-bold">Filter Tags</h3>
							<button
								class="focus:outline-none w-5 h-5"
								id="close-filter-panel"
								on:click={filterPanel.close}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-3 w-3 ml-1 inline-block"
									viewBox="0 0 20 20"
									fill="#333"
								>
									<path
										fill-rule="evenodd"
										d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg></button
							>
						</div>
						<div class="flex flex-row gap-2 flex-wrap">
							{#each allTags as tag (tag.id)}
								<button
									class="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-md whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed overflow-y-hidden"
									class:text-white={filterTags.includes(tag.name)}
									class:bg-main={filterTags.includes(tag.name)}
									disabled={!possibleTagNames.includes(tag.name) && possibleTagNames.length !== 0}
									on:click={() => toggleTag(tag.name)}
								>
									# {tag.name}
								</button>
							{/each}
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>

<div class="w-full flex justify-center">
	<div class="mx-8 md:mt-8 mt-2 max-w-screen-2xl flex flex-col gap-12 w-full">
		<div class="flex flex-row gap-4">
			<div class="relative grow">
				<div class="absolute inset-y-0 left-0 flex items-center p-4 pointer-events-none">
					<svg
						aria-hidden="true"
						class="w-5 h-5 text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
				</div>
				<input
					type="search"
					id="search"
					class="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
					placeholder="Search Bookmarks..."
					bind:value={searchString}
					required
				/>
			</div>
			<button
				class="relative focus:outline-none border border-gray-300 rounded-lg h-[54px] aspect-square flex justify-center items-center pt-0.5"
				on:click={filterPanel.open}
				id="open-filter-panel"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none">
					<path
						d="M18 5H6C5.5286 5 5.29289 5 5.14645 5.14645C5 5.29289 5 5.5286 5 6V7.96482C5 8.2268 5 8.35779 5.05916 8.46834C5.11833 8.57888 5.22732 8.65154 5.4453 8.79687L8.4688 10.8125C9.34073 11.3938 9.7767 11.6845 10.0133 12.1267C10.25 12.5688 10.25 13.0928 10.25 14.1407V19L13.75 17.25V14.1407C13.75 13.0928 13.75 12.5688 13.9867 12.1267C14.2233 11.6845 14.6593 11.3938 15.5312 10.8125L18.5547 8.79687C18.7727 8.65154 18.8817 8.57888 18.9408 8.46834C19 8.35779 19 8.2268 19 7.96482V6C19 5.5286 19 5.29289 18.8536 5.14645C18.7071 5 18.4714 5 18 5Z"
						stroke="#000"
						stroke-width="1.2"
					/></svg
				>
			</button>
		</div>
		<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-8 gap-4">
			{#each filteredBookmarks as bookmark (bookmark.id)}
				<Bookmark {bookmark} />
			{/each}
		</div>
	</div>
</div>

<style>
	#search::-webkit-search-cancel-button {
		margin-left: 1rem;
	}
</style>

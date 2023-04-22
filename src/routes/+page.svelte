<script lang="ts">
	import Bookmark from "../components/Bookmark.svelte";

	export let data;

	let searchString = "";
	$: filteredBookmarks = data.bookmarks.data.filter((bookmark) =>
		bookmark.title.toLowerCase().includes(searchString.toLowerCase()),
	);
</script>

<div class="mx-8 mt-8 mb-16 lg:max-w-screen-2xl lg:mx-auto flex flex-col gap-12">
	<div class="relative">
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
	<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
		{#each filteredBookmarks as bookmark (bookmark.id)}
			<Bookmark {bookmark} />
		{/each}
	</div>
</div>

<style>
	#search::-webkit-search-cancel-button {
		margin-left: 1rem;
	}
</style>

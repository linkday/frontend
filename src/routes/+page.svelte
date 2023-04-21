<script lang="ts">
	import Bookmark from "../components/Bookmark.svelte";

	export let data;
</script>

<div class="mx-8 mt-12 mb-20">
	<div class="grid lg:max-w-screen-2xl lg:mx-auto lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
		{#each data.bookmarks.data as bookmark (bookmark.id)}
			<Bookmark {bookmark} />
		{/each}
	</div>
</div>

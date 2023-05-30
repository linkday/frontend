<script lang="ts">
	import Feed from "../../components/Feed.svelte";

	export let data;
</script>

<div class="w-full flex justify-center">
	<div class="mx-8 md:mt-8 mt-2 max-w-screen-2xl flex flex-col gap-12 w-full">
		{#if data.feeds.data.length === 0}
			<div
				class="fixed w-screen h-screen top-0 left-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center"
			>
				<span>
					<a href="/bookmarks/add" class="underline mr-1">Add bookmark</a> to generate your personalized
					feeds.
				</span>
				<span class="mt-2">
					Already have bookmarks? Don't worry, it will take longer to generate feeds for the first
					time.
				</span>
			</div>
		{:else}
			<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-8 gap-4">
				{#each data.feeds.data as feed}
					<Feed {feed} />
				{/each}
			</div>
		{/if}
	</div>
</div>

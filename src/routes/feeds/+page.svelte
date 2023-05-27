<script lang="ts">
	import Feed from "../../components/Feed.svelte";

	export let data;
</script>

<div class="w-full flex justify-center">
	<div class="mx-8 md:mt-8 mt-2 max-w-screen-2xl flex flex-col gap-12 w-full">
		<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-8 gap-4">
			{#each data.feeds.data as feed}
				<Feed {feed} />
			{/each}
		</div>
	</div>
</div>

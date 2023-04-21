<script lang="ts">
	import type { types } from "../api/api";

	export let bookmark: types["Bookmark"];
</script>

<button
	class="text-left self-start mb-6"
	on:click={() => {
		window.open(bookmark.url, "_blank");
	}}
>
	<div class="flex md:flex-col flex-row md:gap-2 gap-8">
		<div class="md:h-64 h-full !md:aspect-square !md:self-center !md:h-[125px]">
			<img
				src={bookmark.thumbnail_url}
				alt={bookmark.thumbnail_url}
				class="w-full h-full object-cover object-center rounded-md hover:opacity-80 duration-500"
			/>
		</div>
		<div class="flex flex-col gap-2 overflow-x-hidden">
			<div class="text-xs text-gray-400 mt-2">
				{new Date(bookmark.created_at).toLocaleString()}
			</div>
			<div class="flex flex-col gap-2">
				<div class="font-bold md:text-3xl text-xl md:line-clamp-2 line-clamp-3 hover:underline">
					{bookmark.title}
				</div>
				<div class="flex flex-row gap-2 flex-wrap mt-1 !md:hidden">
					{#each bookmark.tags as tag (tag.id)}
						<div class="px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded-md whitespace-nowrap">
							# {tag.name}
						</div>
					{/each}
				</div>
				<div class="text-sm text-gray-500 line-clamp-3 mt-1 !md:hidden">
					{bookmark.description}
				</div>
			</div>
		</div>
	</div>
</button>

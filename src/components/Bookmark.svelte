<script lang="ts">
	import type { Bookmark } from "../api/api.gen";

	export let bookmark: Bookmark;

	function openBookmark() {
		const el = document.querySelector(".extension-enabled");
		if (el && bookmark.incognito) {
			window.dispatchEvent(new CustomEvent("open-incognito", { detail: { url: bookmark.url } }));
			return;
		}

		window.open(bookmark.url, "_blank");
	}
</script>

<div class="text-left self-start md:mb-6">
	<div class="flex md:flex-col flex-row md:gap-2 gap-8">
		<button
			class="md:h-64 md:aspect-auto aspect-square md:self-auto self-center h-[125px]"
			on:click={openBookmark}
		>
			<img
				src={bookmark.thumbnail_url ??
					"https://gis.rchss.sinica.edu.tw/wp-content/plugins/ultimate-post/assets/img/ultp-fallback-img.png"}
				alt={bookmark.thumbnail_url ?? "fallback_img"}
				class="w-full h-full object-cover object-center rounded-md hover:opacity-80 duration-500"
			/>
		</button>
		<div class="flex flex-col gap-2 overflow-x-hidden">
			<div class="text-xs text-gray-400 mt-2">
				{new Date(bookmark.created_at).toLocaleString()}
			</div>
			<div class="flex flex-col gap-2">
				<button class="text-left" on:click={openBookmark}>
					<span class="font-bold md:text-3xl text-xl md:line-clamp-2 line-clamp-3 hover:underline">
						{bookmark.title}
					</span>
				</button>
				<div class="md:flex flex-row gap-2 flex-wrap mt-1 hidden">
					{#if bookmark.incognito}
						<div
							class="px-2 py-1 text-xs text-white bg-main rounded-md whitespace-nowrap overflow-y-hidden"
						>
							Incognito
						</div>
					{/if}
					{#each bookmark.tags as tag (tag.id)}
						<div
							class="px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded-md whitespace-nowrap overflow-y-hidden"
						>
							# {tag.name}
						</div>
					{/each}
				</div>
				<button class="md:block hidden mt-1 text-left" on:click={openBookmark}>
					<span class="text-sm text-gray-500 line-clamp-3 hover:underline">
						{bookmark.description}
					</span>
				</button>
			</div>
		</div>
	</div>
</div>

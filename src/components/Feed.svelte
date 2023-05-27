<script lang="ts">
	import type { Feed } from "../api/api.gen";

	export let feed: Feed;

	function openFeed() {
		window.open(feed.url, "_blank");
	}
</script>

<div class="text-left self-start md:mb-6">
	<div class="flex md:flex-col flex-row md:gap-2 gap-8">
		<button
			class="md:h-64 md:aspect-auto aspect-square md:self-auto self-center h-[125px]"
			on:click={openFeed}
		>
			<img
				src={feed.thumbnail_url ??
					"https://gis.rchss.sinica.edu.tw/wp-content/plugins/ultimate-post/assets/img/ultp-fallback-img.png"}
				alt={feed.thumbnail_url ?? "fallback_img"}
				class="w-full h-full object-cover object-center rounded-md hover:opacity-80 duration-500"
			/>
		</button>
		<div class="flex flex-col gap-2 overflow-x-hidden w-full">
			<div class="flex flex-col gap-2">
				<button class="text-left" on:click={openFeed}>
					<span class="font-bold md:text-3xl text-xl md:line-clamp-2 line-clamp-3 hover:underline">
						{feed.title}
					</span>
				</button>
				<div class="flex sm:flex-row flex-col sm:gap-8 sm:items-center">
					<span class="text-sm flex flex-nowrap gap-2 text-gray-400">
						<img src="like.svg" alt="like.svg" class="w-4 h-4" /> Recommendation
					</span>
					<div class="w-full bg-gray-200 rounded-full sm:h-1.5 h-1 my-1">
						<div class="bg-main sm:h-1.5 h-1 rounded-full" style="width: {feed.recommendation}%" />
					</div>
				</div>
				<div class="flex sm:flex-row flex-col sm:gap-8 sm:items-center">
					<span class="text-sm flex flex-nowrap opacity-0 gap-2 text-gray-400">
						<img src="like.svg" alt="like.svg" class="w-4 h-4" /> Recommendation
					</span>
					<span class="text-sm flex flex-nowrap absolute gap-2 text-gray-400">
						<img src="similar.svg" alt="similar.svg" class="w-4 h-4" /> Similarity
					</span>
					<div class="w-full bg-gray-200 rounded-full sm:h-1.5 h-1 my-1">
						<div class="bg-main sm:h-1.5 h-1 rounded-full" style="width: {feed.similarity}%" />
					</div>
				</div>
				<button class="md:block hidden mt-1 text-left" on:click={openFeed}>
					<span class="text-sm text-gray-500 line-clamp-3 hover:underline">
						{feed.description}
					</span>
				</button>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import Bookmark from "../components/Bookmark.svelte";
	import type { PageData } from "./$types";
	import { createListbox } from "svelte-headlessui";

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

	$: userGroups = [
		{
			name: "My Bookmarks",
			url: "/bookmarks",
		},
	].concat(
		data.userGroups.data.map((group) => {
			return {
				name: group.name,
				url: `/groups/${group.id}/bookmarks`,
			};
		}),
	);

	const listbox = createListbox({
		label: "Actions",
		selected: {
			name: "My Bookmarks",
			url: "/bookmarks",
		},
	});

	function onSelect(e: Event) {
		console.log("select", (e as CustomEvent).detail);
	}

	let tags: HTMLDivElement;
</script>

<div class="w-[92%] mx-auto my-2 h-[calc(100vh-6rem)] flex lg:flex-row flex-col">
	<div class="lg:hidden z-10 flex w-full flex-col items-center justify-center">
		<div class="mb-8 w-full">
			<div class="relative mt-1">
				<button
					use:listbox.button
					on:select={onSelect}
					class="relative w-full cursor-default rounded-lg bg-gray-100 py-5 pl-7 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
				>
					<div class="flex flex-row justify-between items-center w-full">
						<span class="grow block truncate">{$listbox.selected.name}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 330 330"
							fill="currentColor"
						>
							<path
								xmlns="http://www.w3.org/2000/svg"
								id="XMLID_225_"
								d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
							/>
						</svg>
					</div>
				</button>

				{#if $listbox.expanded}
					<ul
						use:listbox.items
						class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
					>
						{#each userGroups as value (value.name)}
							{@const active = $listbox.active === value}
							{@const selected = $listbox.selected === value}
							<li
								class="relative cursor-default select-none py-4 pl-12 pr-4"
								class:bg-amber-100={active}
								class:text-amber-900={active}
								class:text-gray-900={!active}
								use:listbox.item={{ value }}
							>
								<span
									class="block truncate}"
									class:font-medium={selected}
									class:font-normal={!selected}>{value.name}</span
								>
								{#if selected}
									<span class="absolute inset-y-0 left-0 flex items-center pl-4 text-amber-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												xmlns="http://www.w3.org/2000/svg"
												style="fill:#030104;"
												d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27 c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0 L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
											/>
										</svg>
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>

	<div class="hidden lg:block mt-24 w-1/4">
		<ul class="flex flex-col gap-4">
			<li class="font-bold text-sm text-gray-500">Personal</li>
			<li class="pl-5 list-inside">
				<ul class="flex flex-col gap-2">
					<li class="text-sm">
						<a href="/bookmarks" class="duration-200 hover:text-[#87acec]">My Bookmarks</a>
					</li>
				</ul>
			</li>
			<li class="mt-4 font-bold text-sm text-gray-500">Groups</li>
			<li class="pl-5 list-inside">
				<ul class="flex flex-col gap-2">
					{#each userGroups as userGroup (userGroup.url)}
						<li class="text-sm">
							{userGroup.name}
						</li>
					{/each}
				</ul>
			</li>
		</ul>
	</div>
	<div class="lg:w-1/2 w-full h-[calc(100vh-6rem)] flex flex-col">
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

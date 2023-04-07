<script lang="ts">
	import type { types } from "../api/api";
	import Bookmark from "../components/Bookmark.svelte";
	import type { PageData } from "./$types";
	import { createDialog } from "svelte-headlessui";
	import Transition from "svelte-transition";

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

	let selectedTag: types["TagBookmarks"];
	const tagOperationDialog = createDialog();

	function openTagOperationDialog(tag: types["TagBookmarks"]) {
		selectedTag = tag;
		tagOperationDialog.open();
	}

	function confirmDelete() {
		if (confirm("Are you sure you want to delete this tag?")) {
			deleteTag();
		}
	}

	function deleteTag() {
		data.tagsBookmarks.data = data.tagsBookmarks.data.filter((tag) => tag.id !== selectedTag.id);
		tagOperationDialog.close();
	}

	function saveTag() {
		data.tagsBookmarks.data = data.tagsBookmarks.data.map((tag) => {
			if (tag.id === selectedTag.id) {
				return {
					...tag,
					name: selectedTag.name,
				};
			}
			return tag;
		});

		tagOperationDialog.close();
	}

	function createNewTag() {
		selectedTag = {
			// TODO: change id to uuid
			id: data.tagsBookmarks.data.length + 1,
			name: "",
			bookmarks: [],
		};
		isCreatingTag = true;
		tagOperationDialog.open();
	}

	function saveNewTag() {
		data.tagsBookmarks.data = [...data.tagsBookmarks.data, selectedTag];
		isCreatingTag = false;
		tagOperationDialog.close();
	}

	let isTagSettingOpen = false;
	let isCreatingTag = false;
</script>

<div class="w-[92%] mx-auto my-2 flex lg:flex-row flex-col">
	<div class="relative z-50">
		<Transition show={$tagOperationDialog.expanded}>
			<Transition
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div
					class="fixed inset-0 bg-black bg-opacity-25"
					on:click={tagOperationDialog.close}
					on:keypress={tagOperationDialog.close}
				/>
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
							class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
							use:tagOperationDialog.modal
						>
							<h3 class="text-lg font-medium leading-6 text-gray-900">Operations</h3>
							<div class="mt-6">
								{#if !!selectedTag}
									<input
										type="text"
										class="w-full border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-900"
										placeholder={isCreatingTag ? "New Tag Name" : "Edit Tag"}
										bind:value={selectedTag.name}
									/>
								{/if}
							</div>

							<div class="mt-8">
								<div class="flex flex-row justify-between">
									{#if isCreatingTag}
										<button
											type="button"
											class="inline-flex justify-center rounded-md border border-transparent bg-[#aec9f9] px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											on:click={tagOperationDialog.close}
										>
											Cancel
										</button>
										<button
											type="button"
											class="inline-flex justify-center rounded-md border border-transparent bg-[#169024] px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											on:click={saveNewTag}
										>
											Save
										</button>
									{:else}
										<button
											type="button"
											class="inline-flex justify-center rounded-md border border-transparent bg-[#e95067] px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											on:click={confirmDelete}
										>
											Delete Tag
										</button>
										<div class="flex flex-row gap-4">
											<button
												type="button"
												class="inline-flex justify-center rounded-md border border-transparent bg-[#aec9f9] px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												on:click={tagOperationDialog.close}
											>
												Cancel
											</button>
											<button
												type="button"
												class="inline-flex justify-center rounded-md border border-transparent bg-[#169024] px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
												on:click={saveTag}
											>
												Save
											</button>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</Transition>
	</div>

	<div
		class="lg:block lg:mt-12 mt-8 lg:w-1/4 w-fit !lg:ml-4 mb-12"
		class:hidden={!isTagSettingOpen}
	>
		<div class="relative">
			<div class="font-bold text-gray-500 relative mb-4 left-8">TAGS</div>
			{#each data.tagsBookmarks.data as tag (tag.id)}
				<div class="flex flex-row mb-2 lg:mb-1">
					<button class="absolute" on:click={() => openTagOperationDialog(tag)}>
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
						<span class="text-gray-700 italic truncate w-48"># {tag.name}</span>
					</label>
				</div>
			{/each}
			<button class="flex items-center gap-4 mt-2 mb-2 relative left-8" on:click={createNewTag}>
				<div class="text-gray-400 w-5 h-5 text-3xl flex justify-center items-center">+</div>
				<div class="text-gray-400">Add Tags</div>
			</button>
		</div>
	</div>

	<div
		class="lg:w-1/2 w-full lg:flex min-h-[calc(100vh-6rem)] flex-col"
		class:hidden={isTagSettingOpen}
		class:flex={!isTagSettingOpen}
	>
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
		<div class=" h-full bg-gray-100 flex flex-col rounded-lg p-6 mb-4 gap-6 grow">
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

	<div class="lg:hidden fixed right-8 bottom-12">
		<div class="flex justify-center items-center gap-6 z-10 p-3 rounded-lg shadow-lg bg-[#a6c1ee]">
			<button
				class="duration-1000 w-7 h-7 relative focus:outline-none"
				class:rotate-[390deg]={isTagSettingOpen}
				class:rotate-0={!isTagSettingOpen}
				on:click={() => (isTagSettingOpen = !isTagSettingOpen)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
					<path
						d="M3 9.11011V14.8801C3 17.0001 3 17.0001 5 18.3501L10.5 21.5301C11.33 22.0101 12.68 22.0101 13.5 21.5301L19 18.3501C21 17.0001 21 17.0001 21 14.8901V9.11011C21 7.00011 21 7.00011 19 5.65011L13.5 2.47011C12.68 1.99011 11.33 1.99011 10.5 2.47011L5 5.65011C3 7.00011 3 7.00011 3 9.11011Z"
						class="duration-1000"
						stroke={isTagSettingOpen ? "#863fc8" : "#333"}
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
						class="duration-1000"
						stroke={isTagSettingOpen ? "#863fc8" : "#333"}
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>

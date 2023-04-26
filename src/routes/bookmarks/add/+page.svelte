<script lang="ts">
	import { superValidate, superForm } from "sveltekit-superforms/client";
	import { schemas, type Tag } from "../../../api/api.client";
	import ErrorMessage from "../../../components/ErrorMessage.svelte";
	import { api } from "../../../api";
	import { goto } from "$app/navigation";
	import { tick } from "svelte";

	export let data;

	const { form, errors, constraints } = superForm(data.form);

	const BookmarkPayload = schemas.BookmarkPayload.refine((val) => val.tag_ids.length > 0, {
		message: "At least one tag is required",
		path: ["tag_ids"],
	});

	let tagSerachString = "";
	$: filteredTags = data.tags.data.filter((tag) => {
		if (tagSerachString === "") return false;

		return tag.name.toLowerCase().includes(tagSerachString.toLowerCase());
	});

	let selectedTags: Tag[] = [];
	$: selectedTagNames = selectedTags.map((tag) => tag.name);
	$: $form.tag_ids = selectedTags.map((tag) => tag.id);

	async function addTag(tag: Tag) {
		selectedTags = [...selectedTags, tag];
		tagSerachString = "";

		await tick();
		superValidate($form, BookmarkPayload).then((result) => {
			$errors.tag_ids = result.errors.tag_ids;
		});
	}
	async function createTag() {
		const tag = {
			name: tagSerachString,
		};
		const result = await superValidate(tag, schemas.TagPayload);
		if (!result) return;

		try {
			const newTag = await api.addTag(tag);
			if (newTag.data) {
				// TODO: this is a workaround for mock server, remove it when real server is ready
				newTag.data.name = newTag.data.name.substring(0, 5);

				addTag(newTag.data);
			}
		} catch (error) {
			console.error(error);
		}
	}

	let selectTagPanel: HTMLDivElement;
	$: isSelectTagPanelOpen = tagSerachString !== "";
	async function handleClickEvent(event: MouseEvent) {
		if (selectTagPanel && !selectTagPanel.contains(event.target as Node)) {
			isSelectTagPanelOpen = false;

			await tick();
			superValidate($form, BookmarkPayload).then((result) => {
				$errors.tag_ids = result.errors.tag_ids;
			});
		}
	}
</script>

<svelte:window on:click={handleClickEvent} />

<div class="w-full flex justify-center">
	<div class="mx-8 md:mt-8 mt-2 max-w-screen-2xl flex flex-col gap-12 w-full">
		<div class="md:grid md:grid-cols-2 gap-12">
			<div class="h-[calc(100vh-80px-2rem)] flex flex-col justify-end !md:hidden pb-16">
				<img
					src="/add-bookmark.png"
					alt="add-bookmark"
					class="rounded-md shadow-inner object-cover w-full h-full"
				/>
			</div>
			<div class="h-[calc(100vh-80px-2rem)] flex flex-col md:justify-end pb-16 gap-12">
				<div class="font-bold text-4xl">Add Bookmark</div>
				<form
					method="post"
					class="grid grid-flow-row gap-4"
					on:submit|preventDefault={async () => {
						const result = await superValidate($form, BookmarkPayload);
						if (!result.valid) {
							$errors = result.errors;
							return;
						}

						api
							.addBookmark($form)
							.then((resp) => {
								console.log(resp);
								goto("/");
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				>
					<div class="flex flex-col gap-2">
						<label class="block mb-2 text-md font-medium text-gray-900">
							Url
							<input
								type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2 mb-1"
								placeholder="https://example.com"
								bind:value={$form.url}
								{...$constraints.url}
								on:input={() => {
									superValidate($form, BookmarkPayload).then((result) => {
										$errors.url = result.errors.url;
									});
								}}
							/>

							<ErrorMessage message={$errors.url} />
						</label>

						<label class="block mb-2 text-md font-medium text-gray-900">
							Tags
							<input
								type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2 mb-1"
								placeholder="Add tags..."
								bind:value={tagSerachString}
							/>

							{#if isSelectTagPanelOpen}
								<div class="absolute" bind:this={selectTagPanel}>
									<div
										class="bg-white border border-gray-300 rounded-lg shadow-md p-2 flex flex-col"
									>
										{#if !filteredTags.map((tag) => tag.name).includes(tagSerachString)}
											<button
												class="flex flex-col gap-1 p-2 hover:bg-gray-100 rounded-md"
												on:click={createTag}
											>
												<div class="text-sm font-medium">
													{#if filteredTags.length > 0}
														None of the above
													{:else}
														No tags found
													{/if}
												</div>
												<div class="text-xs text-gray-400">
													Create new tag:
													<span class="text-black font-bold">
														{tagSerachString}
													</span>
												</div>
											</button>
										{/if}
										{#each filteredTags as tag}
											<button
												class="flex flex-col gap-1 p-2 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
												on:click={() => addTag(tag)}
												disabled={selectedTagNames.includes(tag.name)}
											>
												<div class="text-sm font-medium">{tag.name}</div>
												<div class="text-xs text-gray-400">Click to add</div>
											</button>
										{/each}
									</div>
								</div>
							{/if}

							<div class="flex flex-row flex-wrap gap-2 mt-2 justify-start items-start">
								{#each selectedTagNames as tagName (tagName)}
									<button
										class="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-md whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed h-min"
										on:click={async () => {
											selectedTags = selectedTags.filter((tag) => tag.name !== tagName);

											await tick();
											superValidate($form, BookmarkPayload).then((result) => {
												$errors.tag_ids = result.errors.tag_ids;
											});
										}}
									>
										# {tagName}
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
										</svg>
									</button>
								{/each}
							</div>

							<ErrorMessage message={$errors.tag_ids} />
						</label>
					</div>
					<div class="flex justify-end">
						<button
							type="submit"
							class=" w-full text-white bg-main hover:bg-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
							>Add</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

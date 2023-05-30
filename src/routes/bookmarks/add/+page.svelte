<script lang="ts">
	import { superValidate, superForm } from "sveltekit-superforms/client";
	import { schemas, type Tag } from "../../../api/api.gen";
	import ErrorMessage from "../../../components/ErrorMessage.svelte";
	import { api } from "../../../api";
	import { goto } from "$app/navigation";
	import { tick } from "svelte";
	import { createDialog } from "svelte-headlessui";
	import Transition from "svelte-transition";

	export let data;

	const errorPanel = createDialog({ label: "error-panel" });
	let errorMessage = "";

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
			const newTag = await api.addTag(tag, {
				withCredentials: true,
			});
			if (newTag.data) {
				data.tags.data = [...data.tags.data, newTag.data];
				addTag(newTag.data);
			}
		} catch (err) {
			console.error(err);
			errorMessage = "Something went wrong. Please try again later.";
			errorPanel.open();
		}
	}

	let selectTagPanel: HTMLDivElement;
	let currentFocusIndex = 0;
	$: isSelectTagPanelOpen = tagSerachString !== "";
	async function handleClickEvent(event: MouseEvent) {
		if (selectTagPanel && !selectTagPanel.contains(event.target as Node)) {
			isSelectTagPanelOpen = false;
			currentFocusIndex = 0;

			await tick();
			superValidate($form, BookmarkPayload).then((result) => {
				$errors.tag_ids = result.errors.tag_ids;
			});
		}
	}

	let tagButtons: HTMLButtonElement[] = [];
	let tagInputElement: HTMLInputElement;
	$: filteredTagButtons = tagButtons.filter((button) => {
		if (!button) return false;

		return !button.disabled;
	});

	function onTagKeyDown(event: KeyboardEvent) {
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault();

			if (filteredTagButtons.length === 0) return;

			if (document.activeElement === tagInputElement) {
				filteredTagButtons[currentFocusIndex]?.focus();

				return;
			}

			if (event.key === "ArrowDown") {
				currentFocusIndex = (currentFocusIndex + 1) % filteredTagButtons.length;
				filteredTagButtons[currentFocusIndex]?.focus();
			} else if (event.key === "ArrowUp") {
				if (currentFocusIndex === 0) {
					tagInputElement.focus();

					return;
				}

				currentFocusIndex =
					(currentFocusIndex - 1 + filteredTagButtons.length) % filteredTagButtons.length;
				filteredTagButtons[currentFocusIndex]?.focus();
			}
		} else {
			currentFocusIndex = 0;
		}
	}

	let isSubmitting = false;
</script>

<svelte:head>
	<title>Linkday - Add Bookmark</title>
	<meta name="description" content="The add bookmark page of linkday app." />
</svelte:head>

<svelte:window on:click={handleClickEvent} />

<div class="relative z-50">
	<Transition show={$errorPanel.expanded}>
		<Transition
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<button class="fixed inset-0 bg-black bg-opacity-25" on:click={errorPanel.close} />
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
						class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-6"
						use:errorPanel.modal
					>
						<div class="flex flex-row justify-between">
							<h3 class="text-lg font-bold">Error</h3>
							<button
								class="focus:outline-none w-5 h-5"
								id="close-filter-panel"
								on:click={errorPanel.close}
							>
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
								</svg></button
							>
						</div>
						{errorMessage}
						<div class="w-full flex justify-end my-1">
							<button
								class="bg-main hover:bg-hover text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
								on:click={errorPanel.close}
							>
								OK
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>

<div class="w-full flex justify-center">
	<div class="mx-8 md:mt-8 mt-2 max-w-screen-2xl flex flex-col gap-12 w-full">
		<div class="md:grid md:grid-cols-2 xl:gap-20 gap-12">
			<div class="h-[calc(100vh-80px-2rem)] md:flex flex-col justify-end hidden pb-16">
				<img
					src="/add-bookmark.png"
					alt="add-bookmark"
					class="rounded-md shadow-inner object-cover w-full h-full"
				/>
			</div>
			<div class="h-[calc(100vh-80px-2rem)] flex flex-col md:justify-end pb-16 gap-12">
				<div class="font-bold text-4xl">Add Bookmark</div>
				<div class="grid grid-flow-row gap-4">
					<div class="flex flex-col gap-2">
						<label class="block mb-2 font-medium text-gray-900">
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

						<label class="block mb-2 font-medium text-gray-900">
							Tags
							<input
								type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2 mb-1"
								placeholder="Add tags..."
								bind:value={tagSerachString}
								on:keydown={onTagKeyDown}
								bind:this={tagInputElement}
							/>

							{#if isSelectTagPanelOpen}
								<div
									class="absolute md:max-w-[35%] max-w-[calc(100vw-4rem)] z-10"
									bind:this={selectTagPanel}
									on:keydown={onTagKeyDown}
								>
									<div
										class="bg-white border border-gray-300 rounded-lg shadow-md p-2 flex flex-col"
									>
										{#if !filteredTags.map((tag) => tag.name).includes(tagSerachString)}
											<button
												class="flex flex-col gap-1 p-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-md overflow-y-hidden"
												on:click={createTag}
												bind:this={tagButtons[0]}
											>
												<div class="text-sm font-medium">
													{#if filteredTags.length > 0}
														None of the above
													{:else}
														No tags found
													{/if}
												</div>
												<div class="text-xs text-gray-400 text-left">
													Create new tag:
													<span class="text-black font-bold">
														{tagSerachString}
													</span>
												</div>
											</button>
										{/if}
										{#each filteredTags as tag, index (index)}
											<button
												class="flex flex-col gap-1 p-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed overflow-y-hidden"
												on:click={() => addTag(tag)}
												disabled={selectedTagNames.includes(tag.name)}
												bind:this={tagButtons[index + 1]}
											>
												<div class="text-sm font-medium text-left">{tag.name}</div>
												<div class="text-xs text-gray-400">Click to add</div>
											</button>
										{/each}
									</div>
								</div>
							{/if}

							<div class="flex flex-row flex-wrap gap-2 mt-2 justify-start items-start">
								{#each selectedTagNames as tagName (tagName)}
									<button
										class="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-md whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed h-min overflow-y-hidden"
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

						<div class="mb-2 font-medium text-gray-900">
							<div class="flex items-center">
								Incognito Mode
								<label class="relative inline-flex items-center cursor-pointer ml-2">
									<input
										type="checkbox"
										class="sr-only peer"
										bind:checked={$form.incognito}
										{...$constraints.incognito}
										on:change={() => {
											superValidate($form, BookmarkPayload).then((result) => {
												$errors.incognito = result.errors.incognito;
											});
										}}
									/>
									<div
										class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-main"
									/>
								</label>
							</div>
							<ErrorMessage message={$errors.incognito} />
						</div>
					</div>
					<div class="flex justify-end">
						<button
							on:click={async () => {
								const result = await superValidate($form, BookmarkPayload);
								if (!result.valid) {
									$errors = result.errors;
									return;
								}

								isSubmitting = true;

								api
									.addBookmark($form, {
										withCredentials: true,
									})
									.then((resp) => {
										console.log(resp);
										goto("/bookmarks");
									})
									.catch((err) => {
										console.log(err);
										errorMessage = "Something went wrong. Please try again later.";
										errorPanel.open();
									})
									.finally(() => {
										isSubmitting = false;
									});
							}}
							class=" w-full text-white bg-main hover:bg-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 disabled:opacity-50 flex items-center justify-center"
							class:disabled={isSubmitting}
						>
							{#if isSubmitting}
								<svg
									aria-hidden="true"
									class="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									><path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/><path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/></svg
								>
							{/if}
							Add
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { superValidate, superForm } from "sveltekit-superforms/client";
	import { schemas } from "../../../api/api.client";
	import ErrorMessage from "../../../components/ErrorMessage.svelte";
	import { api } from "../../../api";
	import { goto } from "$app/navigation";

	export let data;

	const { form, errors, constraints } = superForm(data.form);
</script>

<div class="w-full flex justify-center">
	<div class="mx-8 md:mt-8 mt-2 max-w-screen-2xl flex flex-col gap-12 w-full">
		<div class="md:grid md:grid-cols-2 gap-12">
			<div class="xl:pr-12 lg:pr-6 h-[calc(100vh-80px-2rem)] flex items-end !md:hidden pb-24">
				<img src="/add-bookmark.png" alt="add-bookmark" class="rounded-md shadow-inner" />
			</div>
			<div
				class="xl:pl-12 lg:pl-6 md:h-[calc(100vh-80px-2rem)] flex flex-col md:justify-end pb-24 gap-12"
			>
				<div class="font-bold text-4xl">Add Bookmark</div>
				<form
					method="post"
					class="grid grid-flow-row gap-4"
					on:submit|preventDefault={async () => {
						const result = await superValidate($form, schemas.BookmarkPayload);
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
								required
								bind:value={$form.url}
								{...$constraints.url}
								on:input={() => {
									superValidate($form, schemas.BookmarkPayload).then((result) => {
										$errors.url = result.errors.url;
									});
								}}
							/>

							<ErrorMessage message={$errors.url} />
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

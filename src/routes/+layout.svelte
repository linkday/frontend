<script lang="ts">
	import { goto, invalidateAll } from "$app/navigation";
	import "../index.css";
	import Transition from "svelte-transition";
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import { api } from "../api";

	export let data;

	let isMenuOpen = false;
	$: addingBookmark = $page.url.pathname === "/bookmarks/add";

	function login() {
		fetch(
			env.PUBLIC_API_PREFIX +
				"/api/v1/auth" +
				(env.PUBLIC_ENV === "development" ? "/test-callback" : "/callback"),
			{
				method: "GET",
				credentials: "include",
			},
		)
			.then((res) => {
				if (res.ok) {
					goto("/bookmarks", {
						invalidateAll: true,
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	function logout() {
		isMenuOpen = false;
		api
			.logout(undefined, {
				withCredentials: true,
			})
			.then(() => {
				invalidateAll();
			});
	}
</script>

<header class="z-20 relative h-20 flex justify-center items-center">
	<nav class="flex justify-between items-center">
		<div class="z-30 bg-white absolute left-0 md:w-full w-screen pb-[2px] flex justify-center">
			<div class="h-20 grow max-w-screen-2xl mx-8 flex justify-between items-center">
				<div class="font-spectrul font-bold text-2xl">LINKDAY</div>
				{#if data.user}
					<div class="duration-500 static hidden left-0 md:flex items-center">
						<ul class="flex flex-row items-center gap-[4vw]">
							<li>
								<a
									class="duration-200 font-bold text-sm text-gray-500 hover:text-main"
									href="/bookmarks">BOOKMARKS</a
								>
							</li>
							<li>
								<a
									class="duration-200 font-bold text-sm text-gray-500 hover:text-main"
									href="/bookmarks">FEEDS</a
								>
							</li>
							<li>
								<a
									class="duration-200 font-bold text-sm text-gray-500 hover:text-main"
									href="/"
									on:click|preventDefault={logout}>LOGOUT</a
								>
							</li>
						</ul>
					</div>
				{/if}
				<div class="flex items-center gap-6">
					{#if data.user}
						<button
							class="bg-main h-9 text-white px-5 py-1 rounded-lg hover:bg-hover whitespace-nowrap duration-300 flex flex-row items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-main"
							on:click={() => goto("/bookmarks/add")}
							disabled={addingBookmark}
						>
							<span class=" font-medium text-xl">+</span>
							<span class="font-bold hidden md:inline text-sm">Add Bookmark</span>
						</button>
						<button
							class="w-10 h-10 relative focus:outline-none md:hidden"
							on:click={() => (isMenuOpen = !isMenuOpen)}
						>
							<div
								class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
							>
								<span
									aria-hidden="true"
									class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
									class:rotate-45={isMenuOpen}
									class:-translate-y-1.5={!isMenuOpen}
								/>
								<span
									aria-hidden="true"
									class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
									class:opacity-0={isMenuOpen}
								/>
								<span
									aria-hidden="true"
									class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
									class:-rotate-45={isMenuOpen}
									class:translate-y-1.5={!isMenuOpen}
								/>
							</div>
						</button>
					{:else}
						<button
							class="bg-main h-9 text-white px-5 py-1 rounded-lg hover:bg-hover whitespace-nowrap duration-300 flex flex-row items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-main"
							on:click={login}
						>
							<span class="font-bold inline text-sm">Get Started</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
		{#if data.user}
			<div
				class="duration-500 md:hidden fixed bg-white min-h-[30vh] left-0 w-full flex items-center shadow-lg"
				class:top-[5rem]={isMenuOpen}
				class:top-[-50rem]={!isMenuOpen}
			>
				<ul class="flex flex-col gap-8 mx-8">
					<li>
						<a
							class="duration-200 font-bold text-sm text-gray-500 hover:text-main"
							href="/bookmarks">BOOKMARKS</a
						>
					</li>
					<li>
						<a
							class="duration-200 font-bold text-sm text-gray-500 hover:text-main"
							href="/bookmarks">FEEDS</a
						>
					</li>
					<li>
						<a
							class="duration-200 font-bold text-sm text-gray-500 hover:text-main"
							href="/"
							on:click|preventDefault={logout}>LOGOUT</a
						>
					</li>
				</ul>
			</div>
		{/if}
	</nav>
</header>

<div class="z-10 relative">
	<Transition show={isMenuOpen}>
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
				on:click={() => (isMenuOpen = false)}
				on:keypress={() => (isMenuOpen = false)}
			/>
		</Transition>
	</Transition>
</div>

<slot />

<style>
	:global(body::-webkit-scrollbar) {
		width: 0.5em;
	}

	:global(body::-webkit-scrollbar-track) {
		background: #eee;
	}

	:global(body::-webkit-scrollbar-thumb) {
		background: #888;
	}

	:global(body::-webkit-scrollbar-thumb:hover) {
		background: #444;
	}
</style>

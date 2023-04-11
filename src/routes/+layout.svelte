<script lang="ts">
	import "../index.css";
	import Transition from "svelte-transition";

	let isMenuOpen = false;
</script>

<header class="z-20 relative h-20 flex justify-center items-center">
	<nav class="flex justify-between items-center">
		<div class="z-30 bg-white absolute left-0 md:w-full w-screen pb-[2px]">
			<div class="h-20 w-[92%] mx-auto flex justify-between items-center">
				<div class="font-spectrul font-bold text-2xl">LINKDAY</div>
				<div class="duration-500 static hidden left-0 md:flex items-center">
					<ul class="flex flex-row items-center gap-[4vw] mr-8">
						<li>
							<a class="duration-200 font-bold text-sm text-gray-500 hover:text-main" href="/"
								>BOOKMARKS</a
							>
						</li>
						<li>
							<a class="duration-200 font-bold text-sm text-gray-500 hover:text-main" href="/"
								>FEEDS</a
							>
						</li>
					</ul>
				</div>
				<div class="flex items-center gap-6">
					<button
						class="font-bold text-sm bg-main text-white px-5 py-2 rounded-full hover:bg-hover whitespace-nowrap"
					>
						SIGN IN
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
				</div>
			</div>
		</div>
		<div
			class="duration-500 md:hidden fixed bg-white min-h-[20vh] left-0 w-full flex items-center shadow-lg"
			class:top-[5rem]={isMenuOpen}
			class:top-[-50rem]={!isMenuOpen}
		>
			<ul class="flex flex-col gap-8 w-[92%] mx-auto">
				<li>
					<a class="duration-200 font-bold text-sm text-gray-500 hover:text-main" href="/"
						>BOOKMARKS</a
					>
				</li>
				<li>
					<a class="duration-200 font-bold text-sm text-gray-500 hover:text-main" href="/">FEEDS</a>
				</li>
			</ul>
		</div>
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

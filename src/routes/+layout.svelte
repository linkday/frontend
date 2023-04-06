<script lang="ts">
	import "../index.css";

	let isMenuOpen = false;
</script>

<header class="bg-white h-20 flex justify-center items-center">
	<nav class="flex justify-between items-center w-[92%] mx-auto sticky">
		<div class="z-10 bg-white h-20 flex justify-between items-center">
			<div class="font-[Spectrul] font-bold text-2xl">LINKDAY</div>
		</div>
		<div
			class="duration-500 md:static fixed bg-white md:min-h-fit min-h-[20vh] left-0 md:w-auto w-full flex items-center md:shadow-none shadow-lg"
			class:top-[5rem]={isMenuOpen}
			class:top-[-50rem]={!isMenuOpen}
		>
			<ul
				class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 w-[92%] mx-auto z-0 md:mr-8"
			>
				<li>
					<a class="duration-200 font-bold text-sm text-gray-500 hover:text-[#87acec]" href="/"
						>BOOKMARKS</a
					>
				</li>
				<li>
					<a class="duration-200 font-bold text-sm text-gray-500 hover:text-[#87acec]" href="/"
						>FEEDS</a
					>
				</li>
			</ul>
		</div>
		<div class="flex items-center gap-6 z-10">
			<button
				class="font-bold text-sm bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec] whitespace-nowrap"
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
	</nav>
</header>

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

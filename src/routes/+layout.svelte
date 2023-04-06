<script lang="ts">
	import "../index.css";

	let isMenuOpen = false;
</script>

<header class="bg-white h-20 flex justify-center items-center">
	<nav class="flex justify-between items-center w-[92%] mx-auto">
		<div class="z-10 bg-white h-20 flex justify-between items-center">
			<div class="font-[Spectrul] font-bold text-2xl">LINKDAY</div>
		</div>
		<div
			class="duration-500 md:static absolute bg-white md:min-h-fit min-h-[20vh] left-0 top-[-100%] md:w-auto w-full flex items-center"
			class:top-[5rem]={isMenuOpen}
		>
			<ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 w-[92%] mx-auto z-0">
				<li>
					<a class="font-[500] hover:text-gray-500" href="/">BOOKMARKS</a>
				</li>
				<li>
					<a class="font-[500] hover:text-gray-500" href="/">FEEDS</a>
				</li>
			</ul>
		</div>
		<div class="flex items-center gap-6 z-10">
			<button
				class="font-[500] bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec] whitespace-nowrap"
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

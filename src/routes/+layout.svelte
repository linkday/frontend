<script lang="ts">
	import "../index.css";
	// @ts-ignore
	import Menu from "svelte-ionicons/Menu.svelte";
	// @ts-ignore
	import Close from "svelte-ionicons/Close.svelte";

	let isMenuOpen = false;
</script>

<header class="bg-white h-20 flex justify-center items-center">
	<nav class="flex justify-between items-center w-[92%] mx-auto">
		<div class="z-10">
			<div class="font-[Spectrul] font-bold text-2xl">LINKDAY</div>
		</div>
		<div
			class="md:static absolute bg-white md:min-h-fit min-h-[20vh] left-0 top-[-100%] md:w-auto w-full flex items-center"
			class:top-[5rem]={isMenuOpen}
		>
			<ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 w-[92%] mx-auto">
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
			{#if isMenuOpen}
				<button
					on:click={() => (isMenuOpen = !isMenuOpen)}
					on:keypress={() => (isMenuOpen = !isMenuOpen)}
				>
					<Close class="text-3xl cursor-pointer md:hidden" />
				</button>
			{:else}
				<button
					on:click={() => (isMenuOpen = !isMenuOpen)}
					on:keypress={() => (isMenuOpen = !isMenuOpen)}
				>
					<Menu class="text-3xl cursor-pointer md:hidden" />
				</button>
			{/if}
		</div>
	</nav>
</header>

<slot />

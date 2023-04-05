<script lang="ts">
	import "../index.css";

	let isMenuOpen = false;

	$: name = isMenuOpen ? "close" : "menu";
</script>

<header class="bg-white h-20 flex justify-center items-center">
	<nav class="flex justify-between items-center w-[92%] mx-auto">
		<div class="z-10">
			<div class="title">LINKDAY</div>
		</div>
		<div
			class="md:static absolute bg-white md:min-h-fit min-h-[20vh] left-0 top-[-100%] md:w-auto w-full flex items-center"
			class:top-[6rem]={isMenuOpen}
		>
			<ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 w-[92%] mx-auto">
				<li>
					<a class="hover:text-gray-500" href="/">Bookmarks</a>
				</li>
				<li>
					<a class="hover:text-gray-500" href="/">Groups</a>
				</li>
				<li>
					<a class="hover:text-gray-500" href="/">Feeds</a>
				</li>
			</ul>
		</div>
		<div class="flex items-center gap-6 z-10">
			<button
				class="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec] whitespace-nowrap"
			>
				Sign in
			</button>
			<ion-icon
				{name}
				class="text-3xl cursor-pointer md:hidden"
				on:click={() => (isMenuOpen = !isMenuOpen)}
				on:keypress={() => (isMenuOpen = !isMenuOpen)}
			/>
		</div>
	</nav>
</header>

<slot />

<style>
	.title {
		font-family: "Spectral", serif;
		font-weight: bold;
		font-size: 1.5rem;
	}
</style>

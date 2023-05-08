<script lang="ts">
	import { Canvas } from "@threlte/core";
	import Scene from "../components/3D/Scene.svelte";
</script>

<svelte:head>
	<title>Linkday - Home</title>
	<meta name="description" content="The home page of linkday app." />
</svelte:head>

<div
	class="h-[calc(100vh-80px)] w-screen overflow-x-visible overflow-y-hidden flex flex-col justify-center items-center"
>
	<div class="absolute w-fit h-fit flex flex-col items-center">
		<div
			class="font-title text-white text-[10rem] scale-y-[5] scale-x-[0.75] pointer-events-none select-none leading-[4]"
		>
			LINKDAY
		</div>
		<div class="text-white pointer-events-none select-none">
			The one you only need. Focus on valuable contents.
		</div>
	</div>
	<Canvas>
		<Scene />
	</Canvas>
</div>

<script lang="ts">
	import { Canvas } from "@threlte/core";
	import Scene from "../components/3D/Scene.svelte";
	import { tweened } from "svelte/motion";
	import { quintIn, quintInOut } from "svelte/easing";

	let canvasDiv: HTMLDivElement;

	const canvasOpacity = tweened(0, {
		duration: 3000,
		easing: quintIn,
	});
	const titleLetterSpacing = tweened(100, {
		delay: 1000,
		duration: 2500,
		easing: quintInOut,
	});
	const titleOpacity = tweened(0, {
		delay: 1000,
		duration: 2000,
		easing: quintIn,
	});

	async function onGltfLoaded() {
		canvasOpacity.set(1);
		titleLetterSpacing.set(0);
		titleOpacity.set(1);
	}
</script>

<svelte:head>
	<title>Linkday - Home</title>
	<meta name="description" content="The home page of linkday app." />
</svelte:head>

<div
	class="h-[calc(100vh-80px)] w-screen overflow-x-visible overflow-y-hidden flex flex-col justify-center items-center"
	style="opacity: {$canvasOpacity}"
	bind:this={canvasDiv}
>
	<div
		class="absolute w-fit h-fit flex flex-col items-center pointer-events-none xl:scale-100 md:scale-90 scale-75"
	>
		<div
			class="font-title text-white text-[10rem] scale-y-[5] scale-x-[0.75] select-none leading-[4]"
			style="letter-spacing: {$titleLetterSpacing}rem; opacity: {$titleOpacity}"
		>
			LINKDAY
		</div>
		<div class="text-white select-none" style="opacity: {$titleOpacity}">
			The one you only need. Focus on valuable contents.
		</div>
	</div>
	<Canvas
		rendererParameters={{
			powerPreference: "high-performance",
			antialias: true,
		}}
	>
		<Scene on:gltf-loaded={onGltfLoaded} />
	</Canvas>
</div>

<script lang="ts">
	import { Canvas } from "@threlte/core";
	import Scene from "../components/3D/Scene.svelte";
	import { tweened } from "svelte/motion";
	import { quintIn, quintInOut } from "svelte/easing";
	import { getGPUTier } from "detect-gpu";

	let canvasDiv: HTMLDivElement;
	let titleScale = 0;
	$: if (canvasDiv) {
		const { width, height } = canvasDiv.getBoundingClientRect();
		titleScale = Math.min(width, height) / 840;
	}

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

	let tierInfo: { isMobile: boolean; tier: number } | undefined = undefined;
	getGPUTier().then((data) => {
		console.log(data);
		const { isMobile, tier } = data;
		if (isMobile || tier) {
			tierInfo = {
				isMobile: isMobile ?? true,
				tier,
			};
		}
	});

	$: highPerf = tierInfo ? tierInfo.tier >= 3 && !tierInfo.isMobile : undefined;
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
		class="absolute w-fit h-fit flex flex-col items-center pointer-events-none"
		style="scale: {titleScale};"
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
	{#if tierInfo}
		<Canvas
			rendererParameters={{
				powerPreference: "high-performance",
				antialias: !highPerf,
				stencil: !highPerf,
				depth: !highPerf,
			}}
			frameloop="demand"
		>
			<Scene {highPerf} on:gltf-loaded={onGltfLoaded} />
		</Canvas>
	{/if}
</div>

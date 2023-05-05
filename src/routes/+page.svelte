<script lang="ts">
	import { Canvas } from "@threlte/core";
	import Scene from "../components/3D/Scene.svelte";

	let canvasDiv: HTMLDivElement;
</script>

<svelte:head>
	<title>Linkday - Home</title>
	<meta name="description" content="The home page of linkday app." />
</svelte:head>

<div bind:this={canvasDiv}>
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	div {
		height: calc(100vh - 80px);
		width: 100vw;
		overflow-x: visible;
	}
</style>

<script lang="ts">
	import { Canvas, OrbitControls, T } from "@threlte/core";
	import Bookmark from "../components/3D/Bookmark.svelte";
	import * as THREE from "three";
	import { onMount } from "svelte";
	import { World } from "@threlte/rapier";

	let canvasDiv: HTMLDivElement;

	let bookmarkMetadata: {
		position: [number, number, number];
		rotation: [number, number, number];
	}[] = [];
	onMount(() => {
		Array.from(Array(100).keys()).forEach((index) => {
			bookmarkMetadata.push({
				position: [
					THREE.MathUtils.randFloatSpread(canvasDiv.clientWidth / 60),
					THREE.MathUtils.randFloatSpread(12),
					-index * 0.25,
				],
				rotation: [
					THREE.MathUtils.randFloatSpread(2 * Math.PI),
					THREE.MathUtils.randFloatSpread(2 * Math.PI),
					THREE.MathUtils.randFloatSpread(2 * Math.PI),
				],
			});
		});
	});
</script>

<svelte:head>
	<title>Linkday - Home</title>
	<meta name="description" content="The home page of linkday app." />
</svelte:head>

<div bind:this={canvasDiv}>
	<Canvas>
		<World gravity={{ y: 0 }}>
			<T.PerspectiveCamera makeDefault near={0.01} far={110} fov={20}>
				<OrbitControls enableZoom={true} />
			</T.PerspectiveCamera>

			<T.DirectionalLight castShadow position={[3, 10, 10]} />
			<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
			<T.AmbientLight intensity={0.2} />

			{#each bookmarkMetadata as { position, rotation }}
				<Bookmark {position} {rotation} />
			{/each}
		</World>
	</Canvas>
</div>

<style>
	div {
		height: calc(100vh - 80px);
		width: 100vw;
		overflow-x: visible;
	}
</style>

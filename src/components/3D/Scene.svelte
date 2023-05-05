<script lang="ts">
	import { T, useThrelte } from "@threlte/core";
	import Bookmark from "./Bookmark.svelte";
	import * as THREE from "three";
	import { onMount } from "svelte";
	import { World } from "@threlte/rapier";
	import { useGltf } from "@threlte/extras";
	import { derived } from "svelte/store";

	const { scene } = useThrelte();
	scene.background = new THREE.Color(0x833cab);
	scene.fog = new THREE.Fog(0x833cab, 0, 35);

	const gltf = useGltf("/3D/bookmark.gltf", {
		useDraco: true,
	});
	const bookmark = derived(gltf, (gltf) => {
		if (!gltf || !gltf.nodes["Scene"]) return;
		return gltf.nodes["Scene"] as THREE.Mesh;
	});

	let bookmarkMetadata: {
		id: number;
		position: [number, number, number];
		rotation: [number, number, number];
	}[] = [];
	onMount(() => {
		Array.from(Array(150).keys()).forEach((index) => {
			bookmarkMetadata.push({
				id: index,
				position: [
					THREE.MathUtils.randFloatSpread(15),
					THREE.MathUtils.randFloatSpread(15),
					-index * 0.12 - 0.02,
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

<!-- <Background path={"/3D/background.png"} /> -->
<World gravity={[0, 0, 0]}>
	<!-- <Debug /> -->
	<T.PerspectiveCamera makeDefault near={0.01} far={110} fov={24} />

	<T.DirectionalLight castShadow position={[3, 10, 10]} />
	<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
	<T.AmbientLight intensity={0.2} />

	{#if $bookmark}
		{#each bookmarkMetadata as { id, position, rotation } (id)}
			<Bookmark {position} {rotation} object={$bookmark.clone()} />
		{/each}
	{/if}
</World>

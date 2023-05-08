<script lang="ts">
	import { T, useFrame, useRender, useThrelte } from "@threlte/core";
	import Bookmark from "./Bookmark.svelte";
	import * as THREE from "three";
	import { onMount } from "svelte";
	import { World } from "@threlte/rapier";
	import { useGltf } from "@threlte/extras";
	import { derived } from "svelte/store";
	import {
		EffectComposer,
		EffectPass,
		RenderPass,
		DepthOfFieldEffect,
		SMAAEffect,
		SMAAPreset,
	} from "postprocessing";
	import { env } from "$env/dynamic/public";
	import Stats from "stats.js";

	if (env.PUBLIC_ENV === "development") {
		const stats = new Stats();
		stats.showPanel(0);

		document.body.appendChild(stats.dom);

		useFrame(() => {
			stats.begin();
			stats.end();
		});
	}

	const { scene, renderer, camera } = useThrelte();
	scene.background = new THREE.Color(0x833cab);
	scene.fog = new THREE.Fog(0x833cab, 0, 35);

	const composer = new EffectComposer(renderer);

	function setupEffectComposer(camera: THREE.Camera) {
		if (window.innerWidth < 768) return;

		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));
		composer.addPass(
			new EffectPass(
				camera,
				new DepthOfFieldEffect(camera, {
					focusDistance: 0.06,
					focalLength: 0.05,
					bokehScale: 3,
				}),
			),
		);

		composer.addPass(
			new EffectPass(
				camera,
				new SMAAEffect({
					preset: SMAAPreset.ULTRA,
				}),
			),
		);
	}

	if (window.innerWidth >= 768) {
		useRender((_, delta) => {
			composer.render(delta);
		});
	}

	$: setupEffectComposer($camera);

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

	let innerWidth: number;
	let innerHeight: number;

	onMount(() => {
		Array.from(Array(Math.ceil(innerWidth / 24)).keys()).forEach((index) => {
			bookmarkMetadata.push({
				id: index,
				position: [
					Math.random() * (innerHeight / 240 - -(innerHeight / 240)) - innerHeight / 240,
					Math.random() * (innerHeight / 120 - -(innerHeight / 120)) - innerHeight / 120,
					-index * 0.075 - 2880 / innerWidth,
				],
				rotation: [
					Math.random() * 2 * Math.PI,
					Math.random() * 2 * Math.PI,
					Math.random() * 2 * Math.PI,
				],
			});
		});
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<!-- <Background path={"/3D/background.png"} /> -->
<World gravity={[0, 0, 0]}>
	<!-- <Debug /> -->
	<T.PerspectiveCamera makeDefault near={0.005} far={110} fov={24} />

	<T.DirectionalLight castShadow position={[3, 10, 10]} />
	<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
	<T.AmbientLight intensity={0.2} />

	{#if $bookmark}
		{#each bookmarkMetadata as { id, position, rotation } (id)}
			<Bookmark {position} {rotation} object={$bookmark.clone()} />
		{/each}
	{/if}
</World>
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
	import { createEventDispatcher } from "svelte";

	export let highPerf = false;
	$: console.log("high-performance:", highPerf);

	const dispatch = createEventDispatcher();

	if (env.PUBLIC_ENV === "development") {
		const stats = new Stats();
		stats.showPanel(0);

		document.body.appendChild(stats.dom);

		useFrame(
			() => {
				stats.begin();
				stats.end();
			},
			{
				invalidate: false,
			},
		);
	}

	const { scene, renderer, camera } = useThrelte();
	scene.background = new THREE.Color(0x833cab);
	scene.fog = new THREE.Fog(0x833cab, 0, 35);
	$: if (renderer) {
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}

	const composer = new EffectComposer(renderer);

	function setupEffectComposer(camera: THREE.Camera) {
		if (!highPerf) return;

		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));
		composer.addPass(
			new EffectPass(
				camera,
				new DepthOfFieldEffect(camera, {
					focusDistance: 0.07,
					focalLength: 0.065,
					bokehScale: 3,
					resolutionScale: 0.5,
				}),
				new SMAAEffect({
					preset: SMAAPreset.ULTRA,
				}),
			),
		);
	}

	$: setupEffectComposer($camera);

	if (highPerf) {
		useRender((_, delta) => {
			composer.render(delta);
		});
	}

	const gltf = useGltf("/3D/bookmark.glb", {
		useMeshopt: true,
	});
	const bookmark = derived(gltf, (gltf) => {
		if (!gltf || !gltf.nodes["Scene"]) return;
		return gltf.nodes["Scene"] as THREE.Mesh;
	});

	$: if ($gltf) {
		dispatch("gltf-loaded");
	}

	let bookmarkMetadata: {
		id: number;
		position: [number, number, number];
		rotation: [number, number, number];
	}[] = [];

	let innerWidth: number;
	let innerHeight: number;

	onMount(() => {
		Array.from(Array(Math.ceil(innerWidth / 128) + 20).keys()).forEach((index) => {
			bookmarkMetadata.push({
				id: index,
				position: [
					Math.random() * (innerWidth / 960 - -(innerWidth / 960)) - innerWidth / 960,
					Math.random() * (innerHeight / 120 - -(innerHeight / 120)) - innerHeight / 120,
					-index * 0.2 - 2,
				],
				rotation: [
					Math.random() * 0.5 * Math.PI,
					Math.random() * 0.5 * Math.PI,
					Math.random() * 0.5 * Math.PI,
				],
			});
		});
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<World gravity={[0, 0, 0]}>
	<!-- <Debug /> -->
	<T.PerspectiveCamera makeDefault near={0.005} far={110} fov={20} position={[-0.5, 0, 0]} />

	<T.DirectionalLight castShadow position={[3, 10, 10]} />
	<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
	<T.AmbientLight intensity={0.2} />

	{#if $bookmark}
		{#each bookmarkMetadata as { id, position, rotation } (id)}
			<Bookmark {position} {rotation} object={$bookmark.clone()} />
		{/each}
	{/if}
</World>

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
		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));
		composer.addPass(
			new EffectPass(
				camera,
				new DepthOfFieldEffect(camera, {
					focusDistance: 0.075,
					focalLength: 0.06,
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

	$: setupEffectComposer($camera);

	useRender((_, delta) => {
		composer.render(delta);
	});

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
		Array.from(Array(100).keys()).forEach((index) => {
			bookmarkMetadata.push({
				id: index,
				position: [
					THREE.MathUtils.randFloatSpread(12),
					THREE.MathUtils.randFloatSpread(18),
					-index * 0.1 - 0.05,
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
	<T.PerspectiveCamera makeDefault near={0.01} far={110} fov={24} focus={1} />

	<T.DirectionalLight castShadow position={[3, 10, 10]} />
	<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
	<T.AmbientLight intensity={0.2} />

	{#if $bookmark}
		{#each bookmarkMetadata as { id, position, rotation } (id)}
			<Bookmark {position} {rotation} object={$bookmark.clone()} />
		{/each}
	{/if}
</World>

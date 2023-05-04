<script lang="ts">
	import type * as THREE from "three";
	import { useFrame, Object3DInstance } from "@threlte/core";
	import { AutoColliders, RigidBody } from "@threlte/rapier";
	import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
	import { GLTF } from "@threlte/extras";

	export let object: THREE.Mesh | undefined = undefined;
	export let position: [number, number, number] = [0, 0, 0];
	export let rotation: [number, number, number] = [0, 0, 0];

	let rigidBody: RapierRigidBody;

	useFrame(() => {
		if (!rigidBody) return;

		if (!rigidBody.isMoving()) {
			let y = rigidBody.translation().y + 0.002;

			if (y > 5) {
				y = -5;
			}

			rigidBody.setTranslation(
				{
					x: rigidBody.translation().x,
					y: y,
					z: rigidBody.translation().z,
				},
				true,
			);
		}
	});
</script>

{#if object}
	<RigidBody
		bind:rigidBody
		position={{
			x: position[0],
			y: position[1],
			z: position[2],
		}}
	>
		<AutoColliders
			shape={"convexHull"}
			rotation={{
				x: rotation[0],
				y: rotation[1],
				z: rotation[2],
			}}
		>
			<Object3DInstance castShadow receiveShadow {object} scale={2} />
			<GLTF
				scale={2}
				url={"/3D/bookmark.gltf"}
				interactive
				on:click={() => {
					rigidBody.applyImpulse({ x: 0, y: 0, z: -0.75 }, true);
				}}
				useDraco
			/>
		</AutoColliders>
	</RigidBody>
{/if}

<script lang="ts">
	import * as THREE from "three";
	import { useFrame, T } from "@threlte/core";
	import { AutoColliders, RigidBody } from "@threlte/rapier";
	import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
	import { interactivity } from "@threlte/extras";
	interactivity();

	export let object: THREE.Mesh | undefined = undefined;
	export let position: [number, number, number] = [0, 0, 0];
	export let rotation: [number, number, number] = [0, 0, 0];

	let rigidBody: RapierRigidBody;

	$: {
		if (rigidBody) {
			rigidBody.setTranslation(
				{
					x: position[0],
					y: position[1],
					z: position[2],
				},
				true,
			);

			const quaternion = new THREE.Quaternion();
			quaternion.setFromEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2], "XYZ"));

			rigidBody.setRotation(
				{
					x: quaternion.x,
					y: quaternion.y,
					z: quaternion.z,
					w: quaternion.w,
				},
				true,
			);

			rigidBody.setLinvel({ x: 0, y: 1.5, z: 0 }, true);

			setTimeout(() => {
				rigidBody.setLinvel({ x: 0, y: 0.2, z: 0 }, true);
			}, 3000);
		}
	}

	let innerHeight: number;

	useFrame(() => {
		if (!rigidBody) return;

		if (!rigidBody.isMoving()) {
			rigidBody.setLinvel({ x: 0, y: 0.25, z: 0 }, true);
		}

		if (rigidBody.translation().y > innerHeight / 150) {
			rigidBody.setTranslation(
				{
					x: rigidBody.translation().x,
					y: -(innerHeight / 150),
					z: rigidBody.translation().z,
				},
				true,
			);
		}
	});
</script>

<svelte:window bind:innerHeight />

{#if object}
	<RigidBody bind:rigidBody>
		<AutoColliders shape={"convexHull"}>
			<T
				castShadow
				receiveShadow
				is={object}
				scale={1.5}
				on:click|once={() => {
					rigidBody.applyImpulse({ x: 0, y: 0, z: -0.2 }, true);
				}}
			/>
		</AutoColliders>
	</RigidBody>
{/if}

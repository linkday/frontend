<script lang="ts">
	import type * as THREE from "three";
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
		}
	}

	useFrame(() => {
		if (!rigidBody) return;

		if (!rigidBody.isMoving()) {
			let y = rigidBody.translation().y + 0.002;

			if (y > 15) {
				y = -15;
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
	<RigidBody bind:rigidBody>
		<AutoColliders shape={"convexHull"}>
			<T
				castShadow
				receiveShadow
				{position}
				{rotation}
				is={object}
				scale={2}
				on:click|once={() => {
					rigidBody.applyImpulse({ x: 0, y: 0, z: -0.5 }, true);
				}}
			/>
		</AutoColliders>
	</RigidBody>
{/if}

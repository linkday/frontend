<script lang="ts">
	import { T, InteractiveObject, useFrame } from "@threlte/core";
	import { AutoColliders, RigidBody } from "@threlte/rapier";
	import type { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";

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

<RigidBody
	bind:rigidBody
	position={{
		x: position[0],
		y: position[1],
		z: position[2],
	}}
	rotation={{
		x: rotation[0],
		y: rotation[1],
		z: rotation[2],
	}}
>
	<AutoColliders shape={"cuboid"}>
		<T.Mesh castShadow let:ref>
			<InteractiveObject
				object={ref}
				interactive
				on:click={() => {
					rigidBody.applyImpulse({ x: 0, y: 0, z: -10 }, true);
				}}
			/>

			<T.BoxGeometry />
			<T.MeshStandardMaterial color="#333333" />
		</T.Mesh>
	</AutoColliders>
</RigidBody>

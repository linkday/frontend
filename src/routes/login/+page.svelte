<script lang="ts">
	import { goto } from "$app/navigation";
	export let data;

	if (data.ok) {
		goto("/bookmarks", {
			invalidateAll: true,
		});
	}
</script>

<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";

	if (browser) {
		goto("/", {
			invalidateAll: true,
		});
	}
</script>

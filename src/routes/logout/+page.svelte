<script lang="ts">
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import { api } from "../../api";

	if (browser) {
		api
			.logout(undefined, {
				withCredentials: true,
			})
			.then(() => {
				goto("/", {
					invalidateAll: true,
				});
			});
	}
</script>

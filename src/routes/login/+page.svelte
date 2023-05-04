<script lang="ts">
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import { env } from "$env/dynamic/public";
	export let data;

	if (browser && data.ok) {
		fetch(
			env.PUBLIC_API_PREFIX +
				"/api/v1/auth" +
				(env.PUBLIC_ENV === "development" ? "/test-callback" : "/callback"),
			{
				method: "GET",
				credentials: "include",
			},
		)
			.then((res) => {
				if (res.ok) {
					goto("/bookmarks", {
						invalidateAll: true,
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
</script>

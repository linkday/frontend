<script lang="ts">
	import { goto } from "$app/navigation";
	import { env } from "$env/dynamic/public";

	if (env.PUBLIC_ENV === "development") {
		fetch(env.PUBLIC_API_PREFIX + "/api/v1/auth/test-callback", {
			method: "GET",
			credentials: "include",
		})
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
	} else {
		goto(env.PUBLIC_API_PREFIX + "/api/v1/auth/login");
	}
</script>

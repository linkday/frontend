import { env } from "$env/dynamic/public";
import * as set_cookie_parser from "set-cookie-parser";

export const load = async ({ cookies }) => {
	const res = await fetch(
		env.PUBLIC_API_PREFIX +
			"/api/v1/auth" +
			(env.PUBLIC_ENV === "development" ? "/test-callback" : "/callback"),
		{
			method: "GET",
			credentials: "include",
		},
	);

	if (res.ok) {
		for (const str of set_cookie_parser.splitCookiesString(
			res.headers.get("set-cookie") ?? undefined,
		)) {
			const { name, value } = set_cookie_parser.parseString(str);
			console.log(name, value);
			cookies.set(name, value);
		}
	}

	return {
		ok: res.ok,
	};
};

import { createApiClient } from "./api.gen";
import { env } from "$env/dynamic/public";

export const api = createApiClient(env.PUBLIC_API_PREFIX);

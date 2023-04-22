import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const User = z.object({
	id: z.string().uuid(),
	username: z.string(),
	email: z.string().email(),
	avatar_url: z.string().url(),
	friend_ids: z.array(z.string()),
	last_logged_in_at: z.coerce.date(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});
const AuthPayload = z.object({ username: z.string(), password: z.string() });
const UserPayload = z.object({
	username: z.string(),
	email: z.string().email(),
	avatar_url: z.string().url(),
	password: z.string(),
});
const UserResponse = z.object({ data: User });
const Tag = z.object({
	id: z.string().uuid(),
	name: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullish(),
});
const Bookmark = z.object({
	id: z.string().uuid(),
	url: z.string().url(),
	title: z.string(),
	description: z.string(),
	thumbnail_url: z.string().url(),
	user_id: z.string().uuid(),
	tags: z.array(Tag),
	created_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullish(),
});
const BookmarksResponse = z.object({ data: z.array(Bookmark) });
const Group = z.object({
	id: z.string().uuid(),
	name: z.string(),
	users: z.array(User),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullish(),
});
const GroupsResponse = z.object({ data: z.array(Group) });
const GroupPayload = z.object({ name: z.string() });
const GroupResponse = z.object({ data: Group.nullable() });
const TagsResponse = z.object({ data: z.array(Tag) });
const BookmarkPayload = z.object({ url: z.string().url() });
const BookmarkResponse = z.object({ data: Bookmark });
const SocialUser = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	bookmark_1_id: z.string().uuid(),
	bookmark_2_id: z.string().uuid(),
	bookmark_3_id: z.string().uuid(),
	similarity: z.number(),
	created_at: z.coerce.date().optional(),
	updated_at: z.coerce.date().optional(),
});
const SocialUsersResponse = z.object({ data: SocialUser });
const MatchPayload = z.object({ user_id: z.string().uuid() });
const MatchResponse = z.object({ data: MatchPayload });

export const schemas = {
	User,
	AuthPayload,
	UserPayload,
	UserResponse,
	Tag,
	Bookmark,
	BookmarksResponse,
	Group,
	GroupsResponse,
	GroupPayload,
	GroupResponse,
	TagsResponse,
	BookmarkPayload,
	BookmarkResponse,
	SocialUser,
	SocialUsersResponse,
	MatchPayload,
	MatchResponse,
};

const endpoints = makeApi([
	{
		method: "get",
		path: "/api/v1/auth/current-user",
		alias: "getCurrentUser",
		requestFormat: "json",
		response: User,
		errors: [
			{
				status: 401,
				description: "Unauthenticated",
				schema: z.void(),
			},
		],
	},
	{
		method: "post",
		path: "/api/v1/auth/login",
		alias: "login",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: AuthPayload,
			},
		],
		response: User,
		errors: [
			{
				status: 401,
				description: "Invalid email or password",
				schema: z.void(),
			},
		],
	},
	{
		method: "post",
		path: "/api/v1/auth/logout",
		alias: "logout",
		requestFormat: "json",
		response: z.void(),
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
		],
	},
	{
		method: "post",
		path: "/api/v1/bookmarks",
		alias: "addBookmark",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ url: z.string().url() }),
			},
		],
		response: BookmarkResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/bookmarks/:bookmarkId",
		alias: "getBookmark",
		requestFormat: "json",
		parameters: [
			{
				name: "bookmarkId",
				type: "Path",
				schema: z.number(),
			},
		],
		response: BookmarkResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The bookmark is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "delete",
		path: "/api/v1/bookmarks/:bookmarkId",
		alias: "deleteBookmark",
		requestFormat: "json",
		parameters: [
			{
				name: "bookmarkId",
				type: "Path",
				schema: z.number(),
			},
		],
		response: z.void(),
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The bookmark is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "post",
		path: "/api/v1/groups",
		alias: "addGroup",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ name: z.string() }),
			},
		],
		response: GroupResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 403,
				description: "The operation is forbidden, only Leader and Admin can create the group",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/groups/:groupId",
		alias: "getGroup",
		requestFormat: "json",
		parameters: [
			{
				name: "groupId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: GroupResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The group is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "patch",
		path: "/api/v1/groups/:groupId",
		alias: "updateGroup",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ name: z.string() }),
			},
			{
				name: "groupId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: GroupResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 403,
				description: "The operation is forbidden, only Leader and Admin can update the group",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The group is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "delete",
		path: "/api/v1/groups/:groupId",
		alias: "deleteGroup",
		requestFormat: "json",
		parameters: [
			{
				name: "groupId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: z.void(),
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 403,
				description: "The operation is forbidden, only Leader and Admin can delete the group",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The group is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/groups/:groupId/bookmarks",
		alias: "getGroupBookmarks",
		requestFormat: "json",
		parameters: [
			{
				name: "groupId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: BookmarksResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The group is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "post",
		path: "/api/v1/social/match",
		alias: "matchUser",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ user_id: z.string().uuid() }),
			},
		],
		response: MatchResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The user is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/social/similar-users",
		alias: "getSimilarUsers",
		requestFormat: "json",
		response: SocialUsersResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/tags",
		alias: "getTags",
		requestFormat: "json",
		response: TagsResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
		],
	},
	{
		method: "post",
		path: "/api/v1/users",
		alias: "addUser",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UserPayload,
			},
		],
		response: UserResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 403,
				description: "The operation is forbidden, only Leader and Admin can create the user",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/users/:userId",
		alias: "getUser",
		requestFormat: "json",
		parameters: [
			{
				name: "userId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: UserResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The user is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "patch",
		path: "/api/v1/users/:userId",
		alias: "updateUser",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: UserPayload,
			},
			{
				name: "userId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: UserResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 403,
				description: "The operation is forbidden, only Leader and Admin can update the user",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The user is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/users/:userId/bookmarks",
		alias: "getUserBookmarks",
		requestFormat: "json",
		parameters: [
			{
				name: "userId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: BookmarksResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The user is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "get",
		path: "/api/v1/users/:userId/groups",
		alias: "getUserGroups",
		requestFormat: "json",
		parameters: [
			{
				name: "userId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: GroupsResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The user is not found",
				schema: z.void(),
			},
		],
	},
]);

export type types = {
	[Key in keyof typeof schemas]: z.infer<(typeof schemas)[Key]>;
};

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
	return new Zodios(baseUrl, endpoints, options);
}

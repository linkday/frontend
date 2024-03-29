import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const User = z.object({
	id: z.string().uuid(),
	username: z.string(),
	email: z.string().email(),
	avatar_url: z.string().url(),
	last_logged_in_at: z.string().datetime(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});
const UserResponse = z.object({ data: User });
const AuthPayload = z.object({ username: z.string(), password: z.string() });
const UserPayload = z.object({
	username: z.string(),
	email: z.string().email(),
	avatar_url: z.string().url(),
	password: z.string(),
});
const Tag = z.object({
	id: z.string().uuid(),
	name: z.string(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
	deleted_at: z.string().datetime().nullish(),
});
const Bookmark = z.object({
	id: z.string().uuid(),
	url: z.string().url(),
	title: z.string(),
	description: z.string(),
	thumbnail_url: z.string().url().optional(),
	user_id: z.string().uuid(),
	tags: z.array(Tag),
	incognito: z.boolean(),
	created_at: z.string().datetime(),
	deleted_at: z.string().datetime().nullish(),
});
const BookmarksResponse = z.object({ data: z.array(Bookmark) });
const Group = z.object({
	id: z.string().uuid(),
	name: z.string(),
	users: z.array(User),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
	deleted_at: z.string().datetime().nullish(),
});
const GroupsResponse = z.object({ data: z.array(Group) });
const GroupPayload = z.object({ name: z.string() });
const GroupResponse = z.object({ data: Group.nullable() });
const TagsResponse = z.object({ data: z.array(Tag) });
const TagPayload = z.object({ name: z.string() });
const TagResponse = z.object({ data: Tag.nullable() });
const BookmarkPayload = z.object({
	url: z.string().url(),
	tag_ids: z.array(z.string()),
	incognito: z.boolean(),
});
const BookmarkResponse = z.object({ data: Bookmark });
const Feed = z.object({
	url: z.string().url(),
	title: z.string(),
	description: z.string(),
	thumbnail_url: z.string().url().optional(),
	similarity: z.number(),
	recommendation: z.number(),
	created_at: z.string().datetime(),
});
const FeedsResponse = z.object({ data: z.array(Feed) });

export type User = z.infer<typeof User>;
export type UserResponse = z.infer<typeof UserResponse>;
export type AuthPayload = z.infer<typeof AuthPayload>;
export type UserPayload = z.infer<typeof UserPayload>;
export type Tag = z.infer<typeof Tag>;
export type Bookmark = z.infer<typeof Bookmark>;
export type BookmarksResponse = z.infer<typeof BookmarksResponse>;
export type Group = z.infer<typeof Group>;
export type GroupsResponse = z.infer<typeof GroupsResponse>;
export type GroupPayload = z.infer<typeof GroupPayload>;
export type GroupResponse = z.infer<typeof GroupResponse>;
export type TagsResponse = z.infer<typeof TagsResponse>;
export type TagPayload = z.infer<typeof TagPayload>;
export type TagResponse = z.infer<typeof TagResponse>;
export type BookmarkPayload = z.infer<typeof BookmarkPayload>;
export type BookmarkResponse = z.infer<typeof BookmarkResponse>;
export type Feed = z.infer<typeof Feed>;
export type FeedsResponse = z.infer<typeof FeedsResponse>;

export const schemas = {
	User,
	UserResponse,
	AuthPayload,
	UserPayload,
	Tag,
	Bookmark,
	BookmarksResponse,
	Group,
	GroupsResponse,
	GroupPayload,
	GroupResponse,
	TagsResponse,
	TagPayload,
	TagResponse,
	BookmarkPayload,
	BookmarkResponse,
	Feed,
	FeedsResponse,
};

export const endpoints = makeApi([
	{
		method: "get",
		path: "/api/v1/auth/current-user",
		alias: "getCurrentUser",
		requestFormat: "json",
		response: UserResponse,
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
		method: "get",
		path: "/api/v1/bookmarks",
		alias: "getBookmarks",
		requestFormat: "json",
		response: BookmarksResponse,
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
				schema: BookmarkPayload,
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
		method: "get",
		path: "/api/v1/feeds",
		alias: "getFeeds",
		requestFormat: "json",
		response: FeedsResponse,
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
		path: "/api/v1/tags",
		alias: "addTag",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ name: z.string() }),
			},
		],
		response: TagResponse,
		errors: [
			{
				status: 401,
				description: "The operation is unauthenticated",
				schema: z.void(),
			},
			{
				status: 403,
				description: "The operation is forbidden, only Leader and Admin can create the tag",
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

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
	return new Zodios(baseUrl, endpoints, options);
}

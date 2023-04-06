import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const User = z.object({
	id: z.number().int(),
	username: z.string(),
	email: z.string().email(),
	avatar_url: z.string(),
	last_logged_in_at: z.coerce.date(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});
const AuthPayload = z.object({ username: z.string(), password: z.string() });
const UserPayload = z.object({
	name: z.string(),
	email: z.string().email(),
	avatar_url: z.string(),
});
const UserResponse = z.object({ data: User });
const Bookmark = z.object({
	id: z.number().int(),
	url: z.string(),
	title: z.string(),
	description: z.string(),
	thumbnail_url: z.string(),
	user_id: z.number().int(),
	tag_ids: z.array(z.number()),
	created_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullish(),
});
const TagBookmarks = z.object({
	id: z.number().int(),
	name: z.string(),
	bookmarks: z.array(Bookmark),
});
const TagsBookmarksResponse = z.object({ data: z.array(TagBookmarks) });
const Group = z.object({
	id: z.number().int(),
	name: z.string(),
	users: z.array(User),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullish(),
});
const GroupsResponse = z.object({ data: z.array(Group) });
const GroupPayload = z.object({ name: z.string() });
const GroupResponse = z.object({ data: Group.nullable() });
const TagPayload = z.object({ name: z.string() });
const Tag = z.object({
	id: z.number().int(),
	name: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	deleted_at: z.coerce.date().nullish(),
});
const TagResponse = z.object({ data: Tag.nullable() });
const BookmarkPayload = z.object({ url: z.string() });
const BookmarkResponse = z.object({ data: Bookmark });

export const schemas = {
	User,
	AuthPayload,
	UserPayload,
	UserResponse,
	Bookmark,
	TagBookmarks,
	TagsBookmarksResponse,
	Group,
	GroupsResponse,
	GroupPayload,
	GroupResponse,
	TagPayload,
	Tag,
	TagResponse,
	BookmarkPayload,
	BookmarkResponse,
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
				schema: z.object({ url: z.string() }),
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
		path: "/api/v1/groups/:groupId/tags/bookmarks",
		alias: "getGroupTags",
		requestFormat: "json",
		parameters: [
			{
				name: "groupId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: TagsBookmarksResponse,
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
				description: "The operation is forbidden, only Manager and Admin can create the tag",
				schema: z.void(),
			},
		],
	},
	{
		method: "patch",
		path: "/api/v1/tags/:tagId",
		alias: "updateTag",
		requestFormat: "json",
		parameters: [
			{
				name: "body",
				type: "Body",
				schema: z.object({ name: z.string() }),
			},
			{
				name: "tagId",
				type: "Path",
				schema: z.number(),
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
				description: "The operation is forbidden, only Manager and Admin can update the tag",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The tag is not found",
				schema: z.void(),
			},
		],
	},
	{
		method: "delete",
		path: "/api/v1/tags/:tagId",
		alias: "deleteTag",
		requestFormat: "json",
		parameters: [
			{
				name: "tagId",
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
				status: 403,
				description: "The operation is forbidden, only Manager and Admin can delete the tag",
				schema: z.void(),
			},
			{
				status: 404,
				description: "The tag is not found",
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
	{
		method: "get",
		path: "/api/v1/users/:userId/tags/bookmarks",
		alias: "getUserTags",
		requestFormat: "json",
		parameters: [
			{
				name: "userId",
				type: "Path",
				schema: z.string(),
			},
		],
		response: TagsBookmarksResponse,
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

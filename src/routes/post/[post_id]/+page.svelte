<script lang="ts">
	import type { Post } from '$lib/post';
	import type { User } from '$lib/user';
	import { marked } from 'marked';

	/** @type {import('./$types').PageData} */
	export let data: { post: Post; currentUser: User | null; postAuthor: User; post_id: string };
</script>

<svelte:head>
	<title>{data.post.title} - Writtr</title>
	<meta name="description" content={data.post.description} />
</svelte:head>

{#if data.post.thumbnail_url != ''}
	<img class="img-fluid" src={data.post.thumbnail_url} alt="Post Thumbnail" />
{/if}

<h1 class="mb-4 mt-2 display-1">
	{data.post.title}
</h1>

<h3 class="text-muted">
	by
	{#if data.currentUser != null}
		{#if data.currentUser.username == data.postAuthor.username}
			Me
		{:else}
			{data.postAuthor.firstName} {data.postAuthor.lastName}
		{/if}

		(<a href="/user/{data.postAuthor.username}">@{data.postAuthor.username}</a>)
		{#if data.currentUser.username == data.postAuthor.username}
			<a href="/update/{data.post_id}">Edit Post</a>
		{/if}
	{:else}
		{data.postAuthor.firstName} {data.postAuthor.lastName}
	{/if}
</h3>

<p class="lead">{data.post.description}</p>

<p class="body-display">{@html marked.parse(data.post.body)}</p>

<style>
	:global(img) {
		max-width: 100%;
		height: auto;
	}
</style>

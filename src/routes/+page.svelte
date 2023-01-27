<script lang="ts">
	import type { Post } from '$lib/post';
	import PostDisplay from '$lib/PostDisplay.svelte';
	import { User } from '$lib/user';

	export let data: { posts: { post: Post; post_id: string }[]; currentUser: User | null };
	let currentUser: User = data.currentUser != null ? data.currentUser : new User({});
</script>

<svelte:head>
    <title>Index - Writtr</title> 
	<meta name="description" content="Writtr is a website where you can post articles easily. Create an account to post content.">
</svelte:head>


<h1 class="mb-4 mt-2 display-1">Index</h1>
<div class="container">
	<div class="row">
		{#each data.posts as post}
			<PostDisplay post={post.post} post_id={post.post_id} {currentUser} />
		{/each}
	</div>
</div>

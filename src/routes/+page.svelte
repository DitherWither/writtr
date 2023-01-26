<script lang="ts">
	import type { Post } from '$lib/post';
	import PostDisplay from '$lib/PostDisplay.svelte';
	export let data: { posts: { post: Post; post_id: string }[] };
</script>

<h1 class="mb-4 mt-2 display-1">Index</h1>
<div class="container">
	<div class="row">
		{#each data.posts as post}
			<PostDisplay post={post.post} post_id={post.post_id} />
		{/each}
	</div>
</div>

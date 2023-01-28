<script lang="ts">
	import type { Post } from '$lib/post';
	import { User } from './user';
	import { getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	export let post: Post;
	export let post_id: string;

	export let currentUser: User;
	export let postAuthor: User = new User({});
	$: isAuthor = postAuthor.username == currentUser.username;

	onMount(async () => {
		try {
			let docSnap = await getDoc(post.author);
			if (docSnap.exists()) {
				postAuthor = new User(docSnap.data());
			}
		} catch (e) {
			console.log(e);
		}
	});

	if (post == null) {
		throw Error('Post was expected');
	}
</script>

<div class="col col-sm-4">
	<a href="/post/{post_id}" class="text-reset text-decoration-none">
		<div class="card" style="width: auto;">
			{#if post.thumbnail_url != ''}
				<img class="card-img-top" src={post.thumbnail_url} alt="Post Thumbnail" />
			{/if}
			<div class="card-body">
				<h2 class="card-title h5">{post.title}</h2>
				<h3 class="card-subtitle mb-2 text-muted h6">
					by
					{#if isAuthor}
						Me
					{:else}
						{postAuthor.firstName} {postAuthor.lastName}
					{/if}
					(<a href="/user/{postAuthor.username}">@{postAuthor.username}</a>)
				</h3>

				<p class="card-text">{post.description}</p>
			</div>
		</div>
	</a>
</div>

<script lang="ts">
	import PostDisplay from '$lib/PostDisplay.svelte';
	import { Post } from '$lib/post';
	import { collection, getDocs, limit, orderBy, query, QuerySnapshot } from 'firebase/firestore';
	import type DocumentData from 'firebase/firestore';
	import { firestore } from '$lib/firebase';

	let posts: { post: Post; post_id: string }[] = [];
	let postsCollection = collection(firestore, 'posts');
	let q = query(postsCollection, orderBy('timestamp', 'desc'), limit(128));

	getDocs(q).then((querySnap: QuerySnapshot<DocumentData>) => {
		querySnap.forEach((doc) => {
			let docData = doc.data();
			console.log(docData);
			posts.push({ post: new Post(docData), post_id: doc.id });
			posts = posts;
		});
	});
</script>

<h1 class="mb-4 mt-2 display-1">Index</h1>
<div class="container">
	<div class="row">
		{#each posts as post}
			<PostDisplay post={post.post} post_id={post.post_id} />
		{/each}
	</div>
</div>

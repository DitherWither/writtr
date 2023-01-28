<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { firestore } from '$lib/firebase';
	import type { Post } from '$lib/post';
	import PostForm from '$lib/PostForm.svelte';
	import type { User } from '$lib/user';
	import { deleteDoc, doc, setDoc } from 'firebase/firestore';

	/** @type {import('./$types').PageData} */
	export let data: { post: Post; currentUser: User | null; postAuthor: User; post_id: string };
	let form: { getFields: () => Post };

	async function update() {
		const fields: Post = form.getFields();
		await setDoc(doc(firestore, 'posts', data.post_id), Object.assign({}, fields));
		await invalidateAll()
		await goto('/');
	}
	async function deletePost() {
		await deleteDoc(doc(firestore, 'posts', data.post_id));
		await invalidateAll()
		await goto('/');
	}
</script>

<h1 class=" mb-4 mt-2">Update Post</h1>

<svelte:head>
	<title>Edit Post - Writtr</title>
	<meta name="description" content="Edit post: {data.post.title}" />
</svelte:head>

<PostForm
	bind:form
	title={data.post.title}
	thumbnail_url={data.post.thumbnail_url}
	description={data.post.description}
	body={data.post.body}
/>
<div class="text-center">
	<button class="btn btn-primary" on:click={update}>Submit</button>
	<button class="btn btn-danger" on:click={deletePost}>Delete</button>
</div>

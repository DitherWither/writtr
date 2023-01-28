<script lang="ts">
	import { requireLogin } from '$lib/user';
	import type { Post } from '$lib/post';
	import PostForm from '$lib/PostForm.svelte';
	import { addDoc, collection } from 'firebase/firestore';
	import { firestore } from '$lib/firebase';
	import { goto } from '$app/navigation';

	let form: { getFields: () => Post };

	requireLogin();

	async function create() {
		let fields: Post = form.getFields();
		try {
			await addDoc(collection(firestore, 'posts'), Object.assign({}, fields));
			goto('/');
			// console.log(fields);
		} catch (error) {
			alert(error);
		}
	}
</script>

<svelte:head>
	<title>Create Post - Writtr</title>
	<meta name="description" content="Create a post on Writtr" />
</svelte:head>

<PostForm bind:form />
<div class="text-center">
	<button class="btn btn-primary" on:click={create}>Submit</button>
</div>

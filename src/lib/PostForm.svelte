<script lang="ts">
	import { Post } from '$lib/post';
	import { auth, firestore } from '$lib/firebase';
	import { Timestamp, doc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { marked } from 'marked';

	export let title = '';
	export let thumbnail_url = '';
	export let description = '';
	export let body = '';

	const user = auth.currentUser;

	if (user == null) {
		alert('User is not logged in');
		goto('/login');
		throw Error('Failed to redirect');
	}
	const userDoc = doc(firestore, `users/${user.uid}`);

	let formFields: Post = new Post({
		title: title,
		thumbnail_url: thumbnail_url,
		description: description,
		body: body,
		timestamp: Timestamp.now(),
		author: userDoc
	});

	export const form: { getFields: () => Post } = {
		getFields: (): Post => {
			formFields.check();
			return formFields;
		}
	};
</script>

<input
	form="create-form"
	name="title"
	class="form-control mb-3"
	bind:value={formFields.title}
	placeholder="Title"
/>
<input
	form="create-form"
	name="thumbnail_url"
	class="form-control mb-3"
	bind:value={formFields.thumbnail_url}
	placeholder="Thumbnail Url"
/>
<p class="text-muted">
	You can add a thumbnail by going to an image host like imgur or ImgBB and getting the direct link
	to the image
</p>

<textarea
	form="create-form"
	name="description"
	id="description"
	class="form-control mb-3"
	placeholder="Description"
	bind:value={formFields.description}
/>

<div class="flex" />

<div class="container">
	<div class="row">
		<div class="col-lg">
			<textarea
				form="create-form"
				name="body"
				id="body"
				class="form-control mb-3"
				style="height: auto; min-height: 20rem"
				bind:value={formFields.body}
			/>
		</div>
		<div class="col-lg card mb-3 mx-2" style="height: auto; min-height: 20rem;">
			<p class="card-body">
				{@html marked(formFields.body)}
			</p>
		</div>
	</div>
</div>

<style>
	:global(img) {
		max-width: 100%;
		height: auto;
	}
</style>

<script lang="ts">
	import type { Post } from '$lib/post';
	import { auth, firestore } from '$lib/firebase';
	import { User } from './user';
	import { doc, getDoc } from 'firebase/firestore';

	let currentUser: User = new User({});
	let postAuthor: User = new User({});
	$: isAuthor = postAuthor.username == currentUser.username;

	async function getUser() {
		const user = auth.currentUser;
		if (user != null) {
			const userDoc = doc(firestore, `users/${user.uid}`);
			const docSnap = await getDoc(userDoc);
			if (docSnap.exists()) {
				currentUser = new User(docSnap.data());
			}
		}
	}

	async function getAuthor() { 
        try {
            let docSnap = await getDoc(post.author);
            if (docSnap.exists()) {
                postAuthor = new User(docSnap.data());
            }
        }
        catch (e) {
            console.log(e);
        }
	}

	getUser();
	getAuthor();

	export let post: Post;
    export let post_id: string;

	if (post == null) {
		throw Error('Post was expected');
	}
</script>

<div class="col col-sm-4">
	<a href="post/{post_id}" class="text-reset text-decoration-none">
		<div class="card" style="width: auto;">
			{#if post.thumbnail_url != ''}
				<img class="card-img-top" src={post.thumbnail_url} alt="Post Thumbnail" />
			{/if}
			<div class="card-body">
				<h5 class="card-title">{post.title}</h5>
				<h6 class="card-subtitle mb-2 text-muted">
					by
					{#if isAuthor}
						Me
					{:else}
						{postAuthor.firstName} {postAuthor.lastName}
					{/if}
					(<a href="/user/{postAuthor.firstName}">@{postAuthor.lastName}</a>)
				</h6>

				<p class="card-text">{post.description}</p>
			</div>
		</div>
	</a>
</div>

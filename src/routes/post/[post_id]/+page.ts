import { error } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '$lib/firebase';
import { Post } from '$lib/post';
import { User } from '$lib/user';

/** @type {import('./$types').PageLoad} */
export async function load({ params }): Promise<object> {
	const docRef = doc(firestore, 'posts', params.post_id);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) throw error(404, 'Not found');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const post = new Post(docSnap.data() as any);

	let currentUser: User | null = null;
	const user = auth.currentUser;

	if (user != null) {
		const userDoc = doc(firestore, `users/${user.uid}`);
		const docSnap = await getDoc(userDoc);
		if (docSnap.exists()) {
			currentUser = new User(docSnap.data());
		}
	}

	let postAuthor: User | null = null;

	try {
		const docSnap = await getDoc(post.author);
		if (docSnap.exists()) {
			postAuthor = new User(docSnap.data());
		}
	} catch (e) {
		console.log(e);
	}

	return { post, currentUser, postAuthor, post_id: params.post_id };
}

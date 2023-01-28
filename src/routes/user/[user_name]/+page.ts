import { Post } from '$lib/post';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '$lib/firebase';
import { getUidByUsername, User } from '$lib/user';

/** @type {import('./$types').PageLoad} */
export async function load({
	params
}): Promise<{ posts: { post: Post; post_id: string }[]; user: User }> {
	const posts: { post: Post; post_id: string }[] = [];
	const postsCollection = collection(firestore, 'posts');

	const uid = await getUidByUsername(params.user_name);
    
	const userDoc = doc(firestore, 'users', uid);
	const user = new User((await getDoc(userDoc)).data() as object);

	const q = query(
		postsCollection,
		where('author', '==', userDoc),
		orderBy('timestamp', 'desc'),
		limit(128)
	);

	const querySnap = await getDocs(q);

	querySnap.forEach((doc) => {
		const docData = doc.data();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		posts.push({ post: new Post(docData as any), post_id: doc.id });
	});

	return { posts, user };
}

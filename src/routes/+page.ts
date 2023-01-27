import { Post } from '$lib/post';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { firestore } from '$lib/firebase';

export async function load(): Promise<{ posts: { post: Post; post_id: string }[] }> {
	const posts: { post: Post; post_id: string }[] = [];
	const postsCollection = collection(firestore, 'posts');
	const q = query(postsCollection, orderBy('timestamp', 'desc'), limit(128));

	const querySnap = await getDocs(q);

	querySnap.forEach((doc) => {
		const docData = doc.data();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		posts.push({ post: new Post(docData as any), post_id: doc.id });
	});

	return { posts };
}

import { Timestamp, type DocumentReference } from 'firebase/firestore';

import { User } from '$lib/user';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '$lib/firebase';

export class Post {
	title: string;
	thumbnail_url: string;
	description: string;
	body: string;
	timestamp: Timestamp;
	author: DocumentReference;

	constructor(post: {
		title: string;
		thumbnail_url: string;
		description: string;
		body: string;
		timestamp: Timestamp;
		author: DocumentReference;
	}) {
		this.title = post.title ?? '';
		this.thumbnail_url = post.thumbnail_url ?? '';
		this.description = post.description ?? '';
		this.body = post.body ?? '';
		this.timestamp = post.timestamp ?? Timestamp.now();
		this.author = post.author;
	}
	public check() {
		if (this.title == '') throw new Error("Field 'title' is required");
		else if (this.body == '') throw new Error("Field 'body' is required");
	}
}

export async function getPost(post_id: string): Promise<{ post: Post; author: User }> {
	const docRef = doc(firestore, 'posts', post_id);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) throw Error('404');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const post = new Post(docSnap.data() as any);

	let postAuthor: User | null = null;

	try {
		const docSnap = await getDoc(post.author);
		if (docSnap.exists()) {
			postAuthor = new User(docSnap.data());
		}
	} catch (e) {
		console.log(e);
	}
	return { post, author: postAuthor ?? new User({}) };
}

import { getPost, Post } from '$lib/post';
import { User } from '$lib/user';

// TODO: Replace object with the actual types
/** @type {import('./$types').PageLoad} */
export async function load({
	params
}): Promise<{ post: Post; currentUser: User | null; postAuthor: User; post_id: string }> {
	const currentPost: { post: Post; author: User } = await getPost(params.post_id);

	return {
		post: currentPost.post,
		postAuthor: currentPost.author,
		currentUser: await User.getCurrent(),
		post_id: params.post_id
	};
}

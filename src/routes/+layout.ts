import { User } from '$lib/user';

export const ssr = false;
export const csr = true;

export async function load(): Promise<{ currentUser: User | null; isSignedIn: boolean }> {
	const currentUser: User | null = await User.getCurrent();
	const isSignedIn = currentUser != null ? true : false;

	return { currentUser, isSignedIn };
}

import { auth, firestore, getCurrentUser } from '$lib/firebase';
import { signOut } from 'firebase/auth';
import { goto, invalidateAll } from '$app/navigation';
import { getDoc, doc } from 'firebase/firestore';

export class User {
	public firstName: string;
	public lastName: string;
	public username: string;

	constructor(obj: { firstName?: string; lastName?: string; username?: string }) {
		// TS does not like the initial assignment happening outside the constructor
		// So calling this.set() wont work
		this.firstName = obj.firstName ?? '';
		this.lastName = obj.lastName ?? '';
		this.username = obj.username ?? '';
	}

	public set(obj: { firstName?: string; lastName?: string; username?: string }) {
		this.firstName = obj.firstName ?? '';
		this.lastName = obj.lastName ?? '';
		this.username = obj.username ?? '';
	}

	public static async getCurrent(): Promise<User | null> {
		const authUser = await getCurrentUser();

		let currentUser: User = new User({});

		if (authUser != null) {
			const userSnap = await getDoc(doc(firestore, `users/${authUser.uid}`));
			// if(!userSnap.exists())
			if (userSnap.exists()) {
				currentUser = new User(userSnap.data());
			} else {
				alert('User is logged in but does not exist in database. How did this happen?');
			}
		} else {
			return null;
		}
		return currentUser;
	}
}

// Redirects the user to / route if logged in
export async function redirectIfLoggedIn() {
	const user = await getCurrentUser();
	if (user != null) goto('/');
}

export async function requireLogin() {
	const user = await getCurrentUser();
	if (user == null) goto('/');
}

export async function logOut() {
	await signOut(auth);
	await invalidateAll();
}

export async function getUidByUsername(username: string): Promise<string> {
	const docSnap = await getDoc(doc(firestore, 'usernames', username));
	if (!docSnap.exists()) return '';
	return docSnap.data().uid;
}

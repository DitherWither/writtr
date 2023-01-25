import { auth } from '$lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { goto } from '$app/navigation';

export class User {
	public firstName: string | undefined;
	public lastName: string | undefined;
	public username: string | undefined;

	constructor(obj: { firstName?: string; lastName?: string; username?: string }) {
		this.set(obj);
	}

	public set(obj: { firstName?: string; lastName?: string; username?: string }) {
		this.firstName = obj.firstName;
		this.lastName = obj.lastName;
		this.username = obj.username;
	}
}

export function redirectIfLoggedIn() {
	onAuthStateChanged(auth, (user) => {
		if (user != null) goto('/');
	});
}

export function requireLogin() {
	onAuthStateChanged(auth, (user) => {
		if (user == null) goto('/');
	});
}

export function logOut() {
	signOut(auth);
}

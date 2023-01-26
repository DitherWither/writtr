import { logOut } from '$lib/user';
import { type User as firebaseUser } from 'firebase/auth';
import { User } from '$lib/user';
import { firestore, auth, getCurrentUser } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const ssr = false;
export const csr = true;

export async function load(): Promise<{ currentUser: User | null, isSignedIn: boolean }> {
    let currentUser: User | null = null;
    let isSignedIn = false;

    const user: firebaseUser | null = await getCurrentUser()

    if (user != null) {
        const userSnap = await getDoc(doc(firestore, `users/${user.uid}`));
        // if(!userSnap.exists())
        if (userSnap.exists()) {
            currentUser = new User(userSnap.data());
            isSignedIn = true;
        } else {
            alert('User is logged in but does not exist in database. How did this happen?');
        }
    } else {
        isSignedIn = false;
    }

    return { currentUser, isSignedIn }
}
import { auth } from '$lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { goto } from '$app/navigation';

export class User {
    public firstName: String | undefined;
    public lastName: String | undefined;
    public username: String | undefined;

    constructor(obj: { firstName?: String, lastName?: String, username?: String }) {
        this.set(obj)
    }

    public set(obj: any) {
        this.firstName = obj["firstName"];
        this.lastName = obj["lastName"];
        this.username = obj["username"]
    }

}

export function redirectIfLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if(user != null) goto("/");
    })
}

export function requireLogin() {
    onAuthStateChanged(auth, (user) => {
        if(user == null) goto("/");
    })
}


export function logOut() {
    signOut(auth)
}
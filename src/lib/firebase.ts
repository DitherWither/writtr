// Import the functions you need from the SDKs you need
import { browser } from '$app/environment';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, onAuthStateChanged, type User as firebaseUser } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { init } from '$lib/vitals';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBP0mDyXr3m7KFTzkedJAK51J9Qxyqx9kE',
	authDomain: 'writtrr-app.firebaseapp.com',
	projectId: 'writtrr-app',
	storageBucket: 'writtrr-app.appspot.com',
	messagingSenderId: '645499059233',
	appId: '1:645499059233:web:23b6ccbf56c003ec827760',
	measurementId: 'G-N46MH77VF2'
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);
export const analytics = (await isSupported()) ? getAnalytics(app) : null;

if (browser) init();

export let isAuthReady = false;

onAuthStateChanged(auth, () => {
	if (!isAuthReady) {
		isAuthReady = true;
	}
});

export const getCurrentUser = (): Promise<firebaseUser | null> => {
	return new Promise((resolve, reject) => {
		if (auth.currentUser) {
			resolve(auth.currentUser);
		}
		const unsubscribe = onAuthStateChanged(
			auth,
			(user) => {
				unsubscribe();
				resolve(user);
			},
			reject
		);
	});
};

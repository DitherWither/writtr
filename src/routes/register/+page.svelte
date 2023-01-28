<script lang="ts">
	import { analytics, auth, firestore } from '$lib/firebase';
	import { AuthErrorCodes } from 'firebase/auth';
	import { Mail16, Key16 } from 'svelte-octicons';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';
	import { redirectIfLoggedIn } from '$lib/user';
	import { goto, invalidateAll } from '$app/navigation';
	import { logEvent } from 'firebase/analytics';

	redirectIfLoggedIn();

	// Gets the data from form, checks it and creates the user

	let userCredentials: {
		user_name: string;
		email: string;
		password: string;
		first_name: string;
		last_name: string;
	} = { user_name: '', email: '', password: '', first_name: '', last_name: '' };
	async function register() {
		console.log(userCredentials);

		if (userCredentials.user_name.length < 3 || userCredentials.user_name.length > 15) {
			alert('Username must be between 3 and 15 characters in length');
			return;
		}

		const ref = doc(firestore, `usernames/${userCredentials.user_name}`);
		const result = await getDoc(ref);

		if (result.exists()) {
			alert('Username is taken');
			return;
		}

		try {
			await createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password);
		} catch (error) {
			switch (error) {
				case AuthErrorCodes.EMAIL_EXISTS:
					alert('Email is already registered');
					break;

				case AuthErrorCodes.INVALID_EMAIL:
					alert('Email is invalid');
					break;

				case AuthErrorCodes.WEAK_PASSWORD:
					alert('Password is too weak');
					break;

				default:
					alert('Error:' + error);
					break;
			}
			return;
		}
		const user = auth.currentUser;
		if (user == null) throw 'User not logged in';
		const userDoc = doc(firestore, `users/${user.uid}`);
		const usernameDoc = doc(firestore, `usernames/${userCredentials.user_name}`);

		const batch = writeBatch(firestore);
		batch.set(userDoc, {
			username: userCredentials.user_name,
			firstName: userCredentials.first_name,
			lastName: userCredentials.last_name,
			email: userCredentials.email
		});
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();
		if (analytics) logEvent(analytics, 'sign_up', { method: 'email' });

		await invalidateAll();
		await goto('/');
	}
</script>

<svelte:head>
	<title>Register - Writtr</title>
	<meta name="description" content="Create a Writtr account" />
</svelte:head>

<div class="position-absolute top-50 start-50 translate-middle card">
	<div class="card-body">
		<h1 class="card-title mb-4 mt-2">Register</h1>
		<form method="post" on:submit|preventDefault={register}>
			<div>
				<div class="input-group mb-3">
					<span class="input-group-text">@</span>
					<input
						name="user_name"
						id="user_name"
						class="form-control"
						placeholder="Username"
						bind:value={userCredentials.user_name}
						required
					/>
				</div>

				<div class="input-group mb-3">
					<span class="input-group-text"><Mail16 /></span>
					<input
						name="email"
						id="email"
						class="form-control"
						placeholder="Email"
						bind:value={userCredentials.email}
						required
					/>
				</div>

				<div class="input-group">
					<span class="input-group-text"><Key16 /></span>
					<input
						type="password"
						name="password"
						id="password"
						class="form-control"
						placeholder="Password"
						bind:value={userCredentials.password}
						required
					/>
				</div>

				<div class="my-3">
					<h4 class="fs-6 fw-bold">Display name</h4>
					<div class="input-group">
						<input
							name="first_name"
							id="first_name"
							placeholder="First Name"
							class="form-control"
							bind:value={userCredentials.first_name}
							required
						/>
						<input
							name="last_name"
							id="last_name"
							placeholder="Last Name"
							class="form-control"
							bind:value={userCredentials.last_name}
							required
						/>
					</div>
				</div>

				<div class="text-center">
					<input type="submit" class="btn btn-primary" value="Register" />
				</div>
			</div>
		</form>
		<p class="text-center my-3">
			Already have an account? <br />
			<a href="/login">Log in instead</a>
		</p>
	</div>
</div>

<script lang="ts">
	import { auth, firestore } from '$lib/firebase';
	import { AuthErrorCodes } from 'firebase/auth';
	import { Mail16, Key16 } from 'svelte-octicons';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { doc, getDoc, writeBatch } from 'firebase/firestore';
	import { redirectIfLoggedIn } from '$lib/user';
	import { verifyFormFields } from '$lib/utils';

	redirectIfLoggedIn();

	// Gets the data from form, checks it and creates the user
	async function register(event: Event) {
		let formData = new FormData(event.target as HTMLFormElement);

		let userCredentials;
		try {
			let verifiedCredentials = verifyFormFields(formData);
			userCredentials.user_name = verifiedCredentials.get('first_name');
		} catch (error) {
			alert(error);
			return;
		}
		console.log(userCredentials);

		if (3 <= userCredentials['user_name'] && userCredentials['user_name'].length <= 15) {
			alert('Username must be between 3 and 15 characters in length');
			return;
		}

		const ref = doc(firestore, `usernames/${userCredentials['user_name']}`);
		const result = await getDoc(ref);

		if (result.exists()) {
			alert('Username is taken');
			return;
		}

		try {
			await createUserWithEmailAndPassword(
				auth,
				userCredentials['email'],
				userCredentials['password']
			);
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
		const usernameDoc = doc(firestore, `usernames/${userCredentials['user_name']}`);

		const batch = writeBatch(firestore);
		batch.set(userDoc, {
			username: userCredentials['user_name'],
			firstName: userCredentials['first_name'],
			lastName: userCredentials['last_name'],
			email: userCredentials['email']
		});
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();
	}
</script>

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
						required
					/>
				</div>

				<div class="input-group mb-3">
					<span class="input-group-text"><Mail16 /></span>
					<input name="email" id="email" class="form-control" placeholder="Email" required />
				</div>

				<div class="input-group">
					<span class="input-group-text"><Key16 /></span>
					<input
						type="password"
						name="password"
						id="password"
						class="form-control"
						placeholder="Password"
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
							required
						/>
						<input
							name="last_name"
							id="last_name"
							placeholder="Last Name"
							class="form-control"
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

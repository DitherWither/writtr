<script lang="ts">
	import { redirectIfLoggedIn } from '$lib/user';
	import { auth } from '$lib/firebase';
	import { Mail16, Key16 } from 'svelte-octicons';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let userCredentials: { email: string; password: string } = {
		email: '',
		password: ''
	};

	redirectIfLoggedIn();
	async function login() {
		try {
			await signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password);
		} catch (e) {
			alert(e);
		}
		goto('/');
	}
</script>

<svelte:head>
	<title>Login - Writtr</title>
	<meta name="description" content="Log into Writtr" />
</svelte:head>

<div class="position-absolute top-50 start-50 translate-middle card">
	<div class="card-body">
		<h1 class="card-title mb-4 mt-2">Log in</h1>
		<form on:submit|preventDefault={login}>
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
			<div class="input-group mb-3">
				<span class="input-group-text"><Key16 /></span>
				<input
					type="password"
					name="password"
					id="password"
					class="form-control"
					placeholder="Password"
					required
					bind:value={userCredentials.password}
				/>
			</div>
			<div class="text-center">
				<input type="submit" class="btn btn-primary" value="Login" />
			</div>
		</form>
		<p class="text-center my-3">
			Don't have an account? <br />
			<a href="/register">Create an account instead</a>
		</p>
	</div>
</div>

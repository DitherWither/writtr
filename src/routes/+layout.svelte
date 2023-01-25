<script>
	import '../app.scss';
	import { logOut } from '$lib/user';
	import { onAuthStateChanged } from 'firebase/auth';
	import { firestore, auth } from '$lib/firebase';
	import { doc, getDoc } from 'firebase/firestore';

	let currentUser = null;
	let authLoaded = false;
	let isSignedIn = false;

	onAuthStateChanged(auth, async (user) => {
		if (!authLoaded) {
			authLoaded = true;
			console.log('Auth is ready');
		}
		if (user) {
			const userSnap = await getDoc(doc(firestore, `users/${user.uid}`));
			// if(!userSnap.exists())
			if (userSnap.exists()) {
				currentUser = userSnap.data();
				isSignedIn = true;
			} else {
				alert('User is logged in but does not exist in database. How did this happen?');
			}
		} else {
			isSignedIn = false;
		}
	});
</script>

{#if !authLoaded}
	<h1>Loading...</h1>
{:else}
	<nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
		<div class="container-fluid">
			<a class="navbar-brand page-title fs-3" href="/">
				<img src="/writtr.svg" width="40" height="40" alt="" />
				Writtr
			</a>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon" />
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					{#if isSignedIn}
						<li class="nav-item fs-5">
							<a class="nav-link active font-weight-bold" href="/create">Create Post</a>
						</li>
						<li class="nav-item fs-5">
							<button class="btn btn-link nav-link active" on:click={logOut}>Log out</button>
						</li>
					{:else}
						<li class="nav-item fs-5"><a class="nav-link active" href="/register">Register</a></li>
						<li class="nav-item fs-5"><a class="nav-link active" href="/login">Log in</a></li>
					{/if}
				</ul>
				{#if isSignedIn}
					<h1 class="navbar-brand">
						Currently logged in as {currentUser.firstName}
						{currentUser.lastName} (<a href="???">@{currentUser.username}</a>)
					</h1>
				{/if}
			</div>
		</div>
	</nav>
	<div class="content container">
		<slot />
	</div>
	<footer>
		<!-- TODO actually make a footer -->
		<!-- This is more for padding then actually a footer -->
		<br />
		<br />
		<br />
	</footer>
{/if}

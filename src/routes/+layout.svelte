<script lang="ts">
	import type { User } from '$lib/user';
	import { logOut } from '$lib/user';
	import '../app.scss';
	import 'bootstrap';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r: ServiceWorkerRegistration) {
					r &&
						setInterval(() => {
							console.log('Checking for sw update');
							r.update();
						}, 20000 /* 20s for testing purposes */);
					console.log(`SW Registered: ${r}`);
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onRegisterError(error: any) {
					console.log('SW registration error', error);
				}
			});
		}
	});
	export let data: { currentUser: User | null; isSignedIn: boolean };
</script>

<nav class="navbar navbar-expand-lg bg-light fixed-top">
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
				{#if data.isSignedIn}
					<li class="nav-item fs-5">
						<a class="nav-link active font-weight-bold" href="/create">Create Post</a>
					</li>
					<li class="nav-item fs-5">
						<!-- Using inline styles as a fix for odd styling -->
						<button
							class="btn btn-link nav-link active"
							on:click={logOut}
							style="font-weight: normal !important;">Log out</button
						>
					</li>
				{:else}
					<li class="nav-item fs-5"><a class="nav-link active" href="/register">Register</a></li>
					<li class="nav-item fs-5"><a class="nav-link active" href="/login">Log in</a></li>
				{/if}
			</ul>
			{#if data.currentUser != null}
				<h1 class="navbar-brand">
					Currently logged in as {data.currentUser.firstName}
					{data.currentUser.lastName} (<a href="???">@{data.currentUser.username}</a>)
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

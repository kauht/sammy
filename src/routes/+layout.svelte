<script lang="ts">
	import './layout.css';
	import Nav from '$lib/components/Nav.svelte';
	import Background from '$lib/components/Background.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	let isLoading = $state(true);
	let isSliding = $state(false);

	onMount(() => {
		const fallback = setTimeout(() => {
			isSliding = true;
			setTimeout(() => {
				isLoading = false;
			}, 800);
		}, 5000);

		return () => {
			clearTimeout(fallback);
		};
	});
</script>

{#if isLoading}
	<div class="loading-screen" class:slide-up={isSliding}>
		<div class="loading-content">
			<div class="name-container">
				<h1 class="name">Sammy</h1>
				<div
					class="fill-bar"
					on:animationend={() => {
						isSliding = true;
						setTimeout(() => {
							isLoading = false;
						}, 800);
					}}
				></div>
			</div>
		</div>
	</div>
	<div class="rounded-div-wrap" class:slide-up={isSliding}>
		<div class="rounded-div"></div>
	</div>
{/if}

<Background>
	<div class="layout-wrapper">
		<Nav {isSliding} />
		<main class="main-content" class:reveal={isSliding}>
			<slot />
		</main>
		<Footer />
	</div>
</Background>

<style>
	.loading-screen {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background: #181818;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: visible;
		transform: translateY(0) translateZ(0);
		transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform;
		backface-visibility: hidden;
	}

	.loading-screen.slide-up {
		transform: translateY(calc(-100vh - 200px));
	}

	.rounded-div-wrap {
		position: fixed;
		top: 100vh;
		left: 0;
		width: 100%;
		height: 200px;
		overflow: hidden;
		pointer-events: none;
		z-index: 9999;
		transform: translateY(0) translateZ(0);
		transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform;
	}

	.rounded-div-wrap.slide-up {
		transform: translateY(calc(-100vh - 200px));
	}

	.rounded-div {
		position: absolute;
		top: -150px;
		left: -10%;
		width: 120%;
		height: 350px;
		background: #181818;
		border-radius: 0 0 50% 50%;
	}

	.loading-content {
		text-align: center;
	}

	.name-container {
		position: relative;
		overflow: hidden;
	}

	.name {
		font-size: 3.5rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.2);
		margin: 0;
		letter-spacing: -0.03em;
		font-family: 'ObviouslyVariable', 'Inter', system-ui, sans-serif;
		position: relative;
	}

	.fill-bar {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 0;
		background: #fff;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		font-size: 3.5rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		font-family: 'ObviouslyVariable', 'Inter', system-ui, sans-serif;
		overflow: hidden;
		pointer-events: none;
		animation: fillText 900ms cubic-bezier(0.05, 0.95, 0.1, 1) 300ms forwards;
	}

	@keyframes fillText {
		to {
			width: 100%;
		}
	}

	.fill-bar::before {
		content: 'Sammy';
		display: block;
		color: #fff;
		white-space: nowrap;
	}

	.layout-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 10;
	}

	.main-content {
		flex: 1;
		width: 100%;
		padding: 6rem 2rem 2rem;
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.main-content.reveal {
		opacity: 1;
		transform: translateY(0);
	}

	@media (min-width: 768px) {
		.main-content {
			padding: 6rem 4rem 4rem;
		}
	}

	@media (max-width: 768px) {
		.name {
			font-size: 2.5rem;
		}

		.fill-bar,
		.fill-bar::before {
			font-size: 2.5rem;
		}
	}
</style>

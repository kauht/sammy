<script lang="ts">
	import "./layout.css";
	import Nav from "$lib/components/Nav.svelte";
	import Background from "$lib/components/Background.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount } from "svelte";

	let isLoading: boolean = true;
	let isSliding: boolean = false;
	let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		fallbackTimer = setTimeout(() => {
			isSliding = true;
			setTimeout(() => {
				isLoading = false;
			}, 800);
		}, 5000);

		return () => {
			if (fallbackTimer !== null) {
				clearTimeout(fallbackTimer);
				fallbackTimer = null;
			}
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
		background: var(--bg-01);
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translateY(0) translateZ(0);
		transition: transform var(--anim-long) var(--anim-ease);
		will-change: transform;
		backface-visibility: hidden;
	}

	.rounded-div-wrap {
		position: fixed;
		top: 100vh;
		left: 0;
		width: 100%;
		height: 200px;
		overflow: hidden;
		pointer-events: none;
		z-index: 9998;
		transform: translateY(0) translateZ(0);
		transition: transform var(--anim-long) var(--anim-ease);
		will-change: transform;
	}

	.loading-screen.slide-up,
	.rounded-div-wrap.slide-up {
		transform: translateY(calc(-100vh - 200px));
	}

	.rounded-div {
		position: absolute;
		top: -150px;
		left: -10%;
		width: 120%;
		height: 350px;
		background: var(--bg-01);
		border-radius: 0 0 50% 50%;
	}

	.loading-content,
	.name-container {
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.name {
		font-size: 3.5rem;
		font-weight: 700;
		color: var(--text-subtle);
		margin: 0;
		letter-spacing: -0.03em;
		position: relative;
	}

	.fill-bar {
		position: absolute;
		inset: 0;
		width: 0;
		background: var(--text);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		font-size: 3.5rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		overflow: hidden;
		pointer-events: none;
		animation: fillText var(--anim-long) var(--anim-ease) var(--anim-fast) forwards;
	}

	@keyframes fillText {
		to {
			width: 100%;
		}
	}

	.fill-bar::before {
		content: "Sammy";
		display: block;
		color: var(--text);
		white-space: nowrap;
	}

	.layout-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 10;
		align-items: center;
	}

	.main-content {
		flex: 1;
		width: 100%;
		max-width: var(--content-max-width, 1100px);
		padding: 6rem var(--content-padding, 2rem) 2rem;
		box-sizing: border-box;
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity var(--anim-long) var(--anim-ease),
			transform var(--anim-long) var(--anim-ease);
	}

	.main-content.reveal {
		opacity: 1;
		transform: translateY(0);
	}

	.content-inner {
		max-width: var(--content-max-width);
		width: 100%;
		padding: 0 var(--content-padding);
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media (min-width: 768px) {
		.main-content {
			padding: 6rem calc(var(--content-padding, 2rem) * 2) 4rem;
		}
	}

	@media (max-width: 768px) {
		.name,
		.fill-bar,
		.fill-bar::before {
			font-size: 2.5rem;
		}
	}
</style>

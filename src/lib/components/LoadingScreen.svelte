<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let name: string = "Sammy";
	export let isSliding: boolean = false;

	const dispatch = createEventDispatcher();

	function onFillAnimationEnd() {
		dispatch("fillend");
		setTimeout(() => dispatch("finished"), 200);
	}
</script>

<div class="loading-screen" class:slide-up={isSliding} role="status" aria-live="polite">
	<div class="loading-content">
		<h1 class="name">{name}</h1>
		<div
			class="fill-bar"
			data-name={name}
			on:animationend={onFillAnimationEnd}
			aria-hidden="true"
		></div>
	</div>
</div>

<div class="rounded-div-wrap" class:slide-up={isSliding} aria-hidden="true">
	<div class="rounded-div" aria-hidden="true"></div>
</div>

<style>
	.loading-screen {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background: var(--bg-01);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform var(--anim-long, 600ms) var(--anim-ease, cubic-bezier(0.22, 1, 0.36, 1));
	}

	.rounded-div-wrap {
		position: fixed;
		top: 100vh;
		left: 0;
		width: 100%;
		height: 200px;
		/* allow the rounded bottom to be visible outside the smaller container */
		overflow: visible;
		/* give the wrap a matching bottom radius so the shape reads correctly */
		border-radius: 0 0 50% 50%;
		pointer-events: none;
		z-index: 9998;
		transition: transform var(--anim-long, 600ms) var(--anim-ease, cubic-bezier(0.22, 1, 0.36, 1));
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

	.loading-content {
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.name {
		margin: 0;
		font-size: 3.5rem;
		font-weight: 700;
		color: var(--text-subtle);
		letter-spacing: -0.03em;
	}

	.fill-bar {
		position: absolute;
		inset: 0;
		width: 0;
		background: var(--text);
		background-clip: text;
		color: transparent;
		font-size: 3.5rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		pointer-events: none;
		animation: fillText 380ms cubic-bezier(0.22, 1, 0.36, 1) var(--anim-fast, 60ms) forwards;
	}

	@keyframes fillText {
		to {
			width: 100%;
		}
	}

	.fill-bar::before {
		content: attr(data-name);
		display: block;
		color: var(--text);
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.name,
		.fill-bar,
		.fill-bar::before {
			font-size: 2.5rem;
		}
	}
</style>

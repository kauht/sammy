<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let { isSliding = $bindable(false) } = $props();

	const tabs = [
		{ name: 'Info', href: '#info' },
		{ name: 'Work', href: '#work' },
		{ name: 'Blog', href: '#blog' },
		{ name: 'Notes', href: '#notes' }
	];

	const tabMap: Record<string, number> = { '#info': 0, '': 0, '#work': 1, '#blog': 2, '#notes': 3 };
	let active = $state(typeof window !== 'undefined' ? (tabMap[window.location.hash] ?? 0) : 0);
	let container: HTMLDivElement;
	let buttons: HTMLButtonElement[] = [];
	let hasMeasured = $state(false);

	const pillLeft = new Tween(5, { duration: 300, easing: cubicOut });
	const pillWidth = new Tween(85, { duration: 300, easing: cubicOut });
	const glowX = new Tween(47.5, { duration: 300, easing: cubicOut });

	function measure() {
		if (!container || !buttons[active]) return;
		const left = Math.round(
			buttons[active].getBoundingClientRect().left - container.getBoundingClientRect().left
		);
		const width = Math.max(24, Math.round(buttons[active].getBoundingClientRect().width));
		const centerX = Math.round(left + width / 2);

		if (hasMeasured) {
			pillLeft.target = left;
			pillWidth.target = width;
			glowX.target = centerX;
		} else {
			pillLeft.set(left, { duration: 0 });
			pillWidth.set(width, { duration: 0 });
			glowX.set(centerX, { duration: 0 });
			hasMeasured = true;
		}
	}

	function handleHashChange() {
		active = tabMap[window.location.hash] ?? 0;
		measure();
	}

	onMount(() => {
		measure();
		window.addEventListener('resize', measure);
		window.addEventListener('hashchange', handleHashChange);
		const ro = new ResizeObserver(measure);
		ro.observe(container);
		buttons.forEach((b) => b && ro.observe(b));
		return () => {
			window.removeEventListener('resize', measure);
			window.removeEventListener('hashchange', handleHashChange);
			ro.disconnect();
		};
	});
</script>

<div class="nav" class:animate={isSliding}>
	<div bind:this={container} class="track">
		<div class="track-outer"></div>
		<div class="track-inner"></div>

		<div class="glow" style="left: {glowX.current}px; transform: translateX(-50%);"></div>
		<div
			class="pill"
			style="transform: translateX({pillLeft.current}px); width: {pillWidth.current}px;"
		></div>

		{#each tabs as tab, i (tab.name)}
			<button
				class="tab"
				class:active={active === i}
				bind:this={buttons[i]}
				onclick={() => (location.hash = tab.href)}
			>
				<span class="label" style:opacity={active === i ? 1 : 0.66}>{tab.name}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.nav {
		position: fixed;
		top: 16px;
		left: 0;
		right: 0;
		z-index: 1000;
		display: flex;
		justify-content: center;
		padding: 8px 0;
		opacity: 0;
		transform: translateY(-40px);
	}

	.nav.animate {
		animation: slideDown 500ms cubic-bezier(0.4, 0, 0.2, 1) 400ms forwards;
	}

	@keyframes slideDown {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.track {
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 340px;
		height: 50px;
		padding: 5px;
		border-radius: 999px;
		overflow: visible;
	}

	.track-outer {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.32),
			inset 0 -1px 1px rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
		pointer-events: none;
	}

	.track-inner {
		position: absolute;
		inset: 1px;
		border-radius: 999px;
		background: linear-gradient(180deg, #3c3c3c 0%, #2d2d2d 100%);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.45);
		pointer-events: none;
	}

	.pill {
		position: absolute;
		top: 5px;
		left: 0;
		height: 40px;
		border-radius: 999px;
		background: rgba(99, 99, 99, 0.2);
		backdrop-filter: blur(6px);
		box-shadow:
			inset 0 1px 4px rgba(0, 0, 0, 0.22),
			0 0 0 1px rgba(255, 255, 255, 0.06);
		pointer-events: none;
		will-change: transform, width;
	}

	.glow {
		position: absolute;
		top: -2px;
		height: 2px;
		width: 28px;
		border-radius: 3px 3px 0 0;
		background: #d9d9d9;
		box-shadow: 0 18px 40px 12px rgba(255, 255, 255, 0.2);
		pointer-events: none;
		will-change: left;
	}

	.tab {
		z-index: 3;
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 999px;
		user-select: none;
	}

	.label {
		font-size: 12px;
		font-weight: 600;
		color: #fff;
		transition: opacity 160ms ease;
		letter-spacing: 0.4px;
	}
</style>

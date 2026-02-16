<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let { isSliding = $bindable(false) } = $props();

	const tabs = [
		{ name: 'Info', href: '#info' },
		{ name: 'Work', href: '#work' },
		{ name: 'Blog', href: '#blog' },
		{ name: 'Notes', href: '#notes' }
	];

	const getActiveIndex = (hash: string) => {
		if (hash === '#info' || hash === '') return 0;
		if (hash === '#work') return 1;
		if (hash === '#blog') return 2;
		if (hash === '#notes') return 3;
		return 0;
	};

	let active = $state(typeof window !== 'undefined' ? getActiveIndex(window.location.hash) : 0);
	let container: HTMLDivElement;
	let buttons: HTMLButtonElement[] = [];
	let hasMeasured = $state(false);

	const estimatedTabWidth = 85;

	function getInitialPosition() {
		const hash = typeof window !== 'undefined' ? window.location.hash : '';
		const index = getActiveIndex(hash);
		const left = 5 + index * (estimatedTabWidth + 8);
		return {
			left,
			width: estimatedTabWidth,
			centerX: left + estimatedTabWidth / 2
		};
	}

	const initial = getInitialPosition();
	const pillLeft = tweened(initial.left, { duration: 300, easing: cubicOut });
	const pillWidth = tweened(initial.width, { duration: 300, easing: cubicOut });
	const glowX = tweened(initial.centerX, { duration: 300, easing: cubicOut });

	function measure() {
		if (!container || !buttons[active]) return;
		const c = container.getBoundingClientRect();
		const b = buttons[active].getBoundingClientRect();
		const left = Math.round(b.left - c.left);
		const width = Math.max(24, Math.round(b.width));
		const centerX = Math.round(left + width / 2);

		if (!hasMeasured) {
			pillLeft.set(left, { duration: 0 });
			pillWidth.set(width, { duration: 0 });
			glowX.set(centerX, { duration: 0 });
			hasMeasured = true;
		} else {
			pillLeft.set(left, { duration: 300 });
			pillWidth.set(width, { duration: 300 });
			glowX.set(centerX, { duration: 300 });
		}
	}

	function handleHashChange() {
		active = getActiveIndex(window.location.hash);
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

		<div
			class="glow"
			style="left: {$glowX}px; transform: translateX(-50%);"
			aria-hidden="true"
		></div>

		<div
			class="pill"
			style="transform: translateX({$pillLeft}px); width: {$pillWidth}px;"
			aria-hidden="true"
		></div>

		{#each tabs as tab, i (tab.name)}
			<button
				type="button"
				class="tab"
				class:active={active === i}
				bind:this={buttons[i]}
				on:click={() => {
					location.hash = tab.href;
				}}
				aria-current={active === i ? 'page' : undefined}
			>
				<span class="label" style:opacity={active === i ? 1 : 0.66}>
					{tab.name}
				</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.nav {
		position: fixed;
		top: 16px;
		inset-inline: 0;
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
		border-radius: calc(999px - 1px);
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
		position: relative;
		z-index: 3;
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
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

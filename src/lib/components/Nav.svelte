<script lang="ts">
	import { onMount, onDestroy } from "svelte";

	const tabs = [
		{ name: "Info", href: "#info" },
		{ name: "Work", href: "#work" },
		{ name: "Blog", href: "#blog" },
		{ name: "Notes", href: "#notes" }
	];

	export let isSliding: boolean = false;

	let track: HTMLElement | null = null;
	let active = 0;
	let pillLeft = 0;
	let pillWidth = 80;
	let glowX = 40;

	const idxFromHash = (h = "") => tabs.findIndex((t) => t.href === h) || 0;

	function measure() {
		if (!track) return;

		const btns = Array.from(track.querySelectorAll("button.tab")) as HTMLElement[];
		const btn = btns[active];
		if (!btn) return;

		const tRect = track.getBoundingClientRect();
		const bRect = btn.getBoundingClientRect();

		const left = Math.round(bRect.left - tRect.left);
		const width = Math.max(64, Math.round(bRect.width)); // enforce a reasonable min width
		const center = Math.round(left + width / 2);

		pillLeft = left;
		pillWidth = width;
		glowX = center;
	}

	onMount(() => {
		if (typeof window !== "undefined") {
			active = idxFromHash(window.location.hash);
		}

		// measure after paint
		requestAnimationFrame(measure);

		const onResize = () => requestAnimationFrame(measure);
		const onHash = () => {
			if (typeof window === "undefined") return;
			active = idxFromHash(window.location.hash);
			requestAnimationFrame(measure);
		};

		window.addEventListener("resize", onResize);
		window.addEventListener("hashchange", onHash);

		onDestroy(() => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("hashchange", onHash);
		});
	});
</script>

<div class="nav" class:animate={isSliding}>
	<div bind:this={track} class="track" role="tablist" aria-label="Main navigation">
		<div class="track-outer" aria-hidden="true"></div>
		<div class="track-inner" aria-hidden="true"></div>

		<div
			class="glow"
			style="left: {glowX}px; transform: translateX(-50%);"
			aria-hidden="true"
		></div>

		<div
			class="pill"
			style="transform: translateX({pillLeft}px); width: {pillWidth}px;"
			aria-hidden="true"
		></div>

		{#each tabs as tab, i (tab.name)}
			<button
				class="tab"
				class:active={active === i}
				on:click={() => {
					if (typeof location !== "undefined") location.hash = tab.href;
					active = i;
					requestAnimationFrame(measure);
				}}
				role="tab"
				aria-current={active === i ? "true" : "false"}
			>
				<span class="label" aria-hidden="false">{tab.name}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	/* container */
	.nav {
		position: fixed;
		top: 16px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		padding: 8px 0;
		z-index: 1000;
	}

	.nav.animate {
		animation: slideDown 500ms cubic-bezier(0.4, 0, 0.2, 1) 400ms both;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-40px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.track {
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 340px;
		height: 50px;
		padding: 5px 6px;
		border-radius: 999px;
		box-sizing: border-box;
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
		z-index: 0;
	}

	.track-inner {
		position: absolute;
		inset: 1px;
		border-radius: 999px;
		background: linear-gradient(180deg, #3c3c3c 0%, #2d2d2d 100%);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.45);
		pointer-events: none;
		z-index: 1;
	}

	.pill {
		position: absolute;
		top: 5px;
		left: 0;
		height: 40px;
		border-radius: 999px;
		background: rgba(99, 99, 99, 0.22);
		backdrop-filter: blur(6px);
		box-shadow:
			inset 0 1px 4px rgba(0, 0, 0, 0.22),
			0 0 0 1px rgba(255, 255, 255, 0.06);
		pointer-events: none;
		transition:
			transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
			width 200ms cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 2;
	}

	.glow {
		position: absolute;
		top: -2px;
		height: 2px;
		width: 28px;
		border-radius: 3px;
		background: #d9d9d9;
		box-shadow: 0 18px 40px 12px rgba(255, 255, 255, 0.2);
		pointer-events: none;
		transition: left 200ms cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 2;
	}

	.tab {
		position: relative;
		z-index: 3;
		flex: 1 1 auto;
		min-width: 72px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 999px;
		background: transparent;
		border: none;
		padding: 0 8px;
		box-sizing: border-box;
	}

	.tab:focus {
		outline: none;
	}

	.label {
		display: inline-block;
		font-size: 12px;
		font-weight: 600;
		color: #fff;
		transition: opacity 160ms ease;
		letter-spacing: 0.4px;
		text-align: center;
		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}

	.tab.active .label {
		opacity: 1;
	}

	.tab .label {
		opacity: 0.75;
	}
</style>

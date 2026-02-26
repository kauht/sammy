<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from "svelte";
	import Chip from "$lib/components/Chip.svelte";

	export let colors: string[] = ["#3B0B66", "#8A5AF8", "#000000", "#0D6BFF"];
	export let favBooks: { title: string; link?: string }[] = [
		{ title: "Red Queen", link: "https://en.wikipedia.org/wiki/Red_Queen_(novel)" },
		{ title: "Lord of the Flies", link: "https://en.wikipedia.org/wiki/Lord_of_the_Flies" },
		{ title: "1984", link: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four" },
		{ title: "V for Vendetta", link: "https://en.wikipedia.org/wiki/V_for_Vendetta" }
	];
	export let genres: string[] = ["Dystopian", "Fantasy", "Fiction", "Technical"];
	export let anime: string[] = [
		"Toradora!",
		"Horimiya",
		"Classroom of the Elite",
		"Forest of Piano",
		"Junji Ito Collection",
		"Heavenly Delusion",
		"My Teen Romantic Comedy SNAFU",
		"A Silent Voice"
	];

	const dispatch = createEventDispatcher<{
		close: void;
		select?: { type: string; item: string };
	}>();

	function close(): void {
		dispatch("close");
	}

	let panel: HTMLElement | null = null;
	let container: HTMLDivElement | null = null;
	let previouslyFocused: Element | null = null;
	let onKey: ((e: KeyboardEvent) => void) | null = null;

	onMount(() => {
		previouslyFocused = typeof document !== "undefined" ? document.activeElement : null;

		// Ensure the portal host is appended to body so backdrop covers the viewport
		if (typeof document !== "undefined" && container && container.parentNode !== document.body) {
			document.body.appendChild(container);
		}

		// focus the panel for accessibility
		setTimeout(() => panel?.focus(), 0);

		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		onKey = handler;
		document.addEventListener("keydown", handler);
	});

	onDestroy(() => {
		if (onKey) document.removeEventListener("keydown", onKey);
		try {
			(previouslyFocused as HTMLElement | null)?.focus?.();
		} catch {
			// ignore
		}
		if (container && container.parentNode) container.parentNode.removeChild(container);
	});

	function openLink(url?: string): void {
		if (url && typeof window !== "undefined") window.open(url, "_blank");
	}

	function selectItem(kind: string, value: string): void {
		dispatch("select", { type: kind, item: value });
	}
</script>

<div bind:this={container} class="portal-host">
	<button class="modal-backdrop" type="button" aria-label="Close" on:click={close} tabindex="-1"
	></button>

	<div
		class="modal-panel"
		role="dialog"
		aria-modal="true"
		aria-label="Personal"
		bind:this={panel}
		tabindex="0"
		on:click|stopPropagation
	>
		<header class="modal-header">
			<div class="current-title">Personal</div>
		</header>

		<div class="modal-body">
			<section class="group">
				<div class="group-title">Favorite colors</div>
				<div class="group-items">
					{#each colors as c (c)}
						<span class="swatch" aria-hidden="true" style="background:{c}"></span>
					{/each}
				</div>
			</section>

			<section class="group">
				<div class="group-title">Favorite books</div>
				<div class="group-items">
					{#each favBooks as b (b.title)}
						{#if b.link}
							<Chip
								clickable
								on:click={() => {
									openLink(b.link);
									selectItem("book", b.title);
								}}>{b.title}</Chip
							>
						{:else}
							<Chip clickable on:click={() => selectItem("book", b.title)}>{b.title}</Chip>
						{/if}
					{/each}
				</div>
			</section>

			<section class="group">
				<div class="group-title">Genres</div>
				<div class="group-items">
					{#each genres as g (g)}<span class="chip">{g}</span>{/each}
				</div>
			</section>

			<section class="group">
				<div class="group-title">Anime</div>
				<div class="group-items">
					{#each anime as a (a)}
						<Chip clickable on:click={() => selectItem("anime", a)}>{a}</Chip>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.portal-host {
		position: fixed;
		inset: 0;
		z-index: 30001;
		pointer-events: none;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);
		z-index: 30002;
		border: 0;
		pointer-events: auto;
	}

	.modal-panel {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 30003;
		width: min(760px, 92%);
		max-height: 85vh;
		background: linear-gradient(180deg, #0b0b0c, #0e0e10);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.045);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		outline: none;
		pointer-events: auto;
	}

	.modal-header {
		padding: 16px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.current-title {
		font-size: 16px;
		font-weight: 800;
		color: rgba(255, 255, 255, 0.95);
	}

	.modal-body {
		padding: 16px;
		display: grid;
		gap: 12px;
		flex: 1 1 auto;
		overflow: auto;
	}

	.group {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
	}

	.group-title {
		width: 160px;
		font-weight: 700;
		color: rgba(234, 238, 242, 0.86);
	}

	.group-items {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		align-items: center;
	}

	.swatch {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.06);
		display: inline-block;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
	}

	.text-item {
		color: rgba(234, 238, 242, 0.9);
		font-weight: 600;
	}

	.chip {
		background: rgba(255, 255, 255, 0.04);
		padding: 6px 8px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		color: rgba(234, 238, 242, 0.9);
	}

	@media (max-width: 720px) {
		.modal-panel {
			width: calc(100% - 32px);
			max-height: calc(100vh - 64px);
		}
		.group-title {
			width: 120px;
		}
	}
</style>

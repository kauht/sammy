<script lang="ts">
	import Chip from "$lib/components/Chip.svelte";
	import { createEventDispatcher, onMount, onDestroy } from "svelte";

	export let tech: { category: string; items: string[] }[] = [];
	export let title = "Tech";

	const dispatch = createEventDispatcher<{
		close: void;
		select: { category: string; item: string };
	}>();

	let container: HTMLDivElement | null = null;
	let panel: HTMLElement | null = null;
	let previouslyFocused: Element | null = null;
	let onKey: ((e: KeyboardEvent) => void) | null = null;

	function close(): void {
		dispatch("close");
	}

	function selectTech(category: string, item: string): void {
		dispatch("select", { category, item });
	}

	onMount(() => {
		previouslyFocused = typeof document !== "undefined" ? document.activeElement : null;

		if (typeof document !== "undefined" && container && container.parentNode !== document.body) {
			document.body.appendChild(container);
		}

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
			void 0;
		}
		if (container && container.parentNode) container.parentNode.removeChild(container);
	});
</script>

<div bind:this={container} class="portal-host">
	<button class="modal-backdrop" type="button" aria-label="Close" on:click={close} tabindex="-1"
	></button>

	<div
		class="modal-panel"
		role="dialog"
		aria-modal="true"
		aria-label={title}
		bind:this={panel}
		tabindex="0"
		on:click|stopPropagation
	>
		<header class="modal-header">
			<div class="current-title">{title}</div>
		</header>

		<div class="modal-body">
			{#if tech.length === 0}
				<p class="empty">No tech items available.</p>
			{:else}
				<div class="list-tech" role="list">
					{#each tech as group (group.category)}
						<section class="group" aria-labelledby={"g-" + group.category}>
							<div class="group-title" id={"g-" + group.category}>{group.category}</div>
							<div class="group-items">
								{#each group.items as t (t)}
									<Chip
										clickable
										variant="frosted"
										size="sm"
										on:click={() => selectTech(group.category, t)}>{t}</Chip
									>
								{/each}
							</div>
						</section>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.portal-host {
		position: fixed;
		inset: 0;
		z-index: 40000;
		pointer-events: auto;
	}

	.modal-backdrop {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);
		z-index: 40001;
		border: 0;
		pointer-events: auto;
	}

	.modal-panel {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 40002;
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
		color: rgba(255, 255, 255, 0.92);
	}

	.modal-body {
		padding: 16px;
		display: grid;
		gap: 12px;
		flex: 1 1 auto;
		overflow: auto;
	}

	.empty {
		margin: 0;
		color: rgba(234, 238, 242, 0.8);
	}

	.list-tech {
		display: grid;
		gap: 12px;
	}

	.group {
		display: flex;
		gap: 12px;
		align-items: flex-start;
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

	.group-items :global(.chip) {
		margin: 0;
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

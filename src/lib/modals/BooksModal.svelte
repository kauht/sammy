<script lang="ts">
	import Chip from "$lib/components/Chip.svelte";
	import { createEventDispatcher, onMount, onDestroy } from "svelte";

	export let books: { title: string; file: string }[] = [];
	export let title = "Books";

	const dispatch = createEventDispatcher<{ close: void; download: { file: string } }>();

	let panel: HTMLElement | null = null;
	let container: HTMLDivElement | null = null;
	let previouslyFocused: Element | null = null;
	let onKey: ((e: KeyboardEvent) => void) | null = null;

	function close(): void {
		dispatch("close");
	}

	function handleDownload(file: string): void {
		dispatch("download", { file });
		if (typeof window !== "undefined") {
			window.open(`/books/${file}`, "_blank");
		}
	}

	onMount(() => {
		previouslyFocused = typeof document !== "undefined" ? document.activeElement : null;

		// make sure the portal container is appended to body so the backdrop covers the full viewport
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
			{#if books.length === 0}
				<p class="empty">No books available.</p>
			{:else}
				<ul class="list-books" role="list">
					{#each books as book (book.file)}
						<li>
							<Chip clickable on:click={() => handleDownload(book.file)}>{book.title}</Chip>
						</li>
					{/each}
				</ul>
			{/if}
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
		color: rgba(234, 238, 242, 0.8);
		margin: 0;
	}

	.list-books {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 8px;
	}

	.list-books :global(.chip) {
		display: block;
		width: 100%;
		text-align: left;
		padding: 10px 12px;
		border-radius: 6px;
		font-weight: 600;
	}

	.list-books :global(.chip):hover,
	.list-books :global(.chip):focus {
		outline: none;
		border: 1px solid rgba(180, 200, 255, 0.28);
		background: rgba(255, 255, 255, 0.02);
	}

	@media (max-width: 720px) {
		.modal-panel {
			width: calc(100% - 32px);
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			max-height: calc(100vh - 64px);
		}
	}
</style>

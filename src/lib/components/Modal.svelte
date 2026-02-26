<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from "svelte";

	export let title = "";
	export let ariaLabel: string | undefined = undefined;
	export let closeOnBackdrop = true;
	export let closeOnEsc = true;
	export let open = false;

	const dispatch = createEventDispatcher<{ close: void }>();

	let container: HTMLDivElement | null = null;
	let panel: HTMLElement | null = null;
	let previouslyFocused: Element | null = null;
	let onKey: ((e: KeyboardEvent) => void) | null = null;

	function close() {
		dispatch("close");
	}

	onMount(() => {
		previouslyFocused = typeof document !== "undefined" ? document.activeElement : null;
		// append the bound container to body so the portal/backdrop cover the whole viewport
		if (typeof document !== "undefined" && container && container.parentNode !== document.body) {
			document.body.appendChild(container);
		}
	});

	$: if (open) {
		previouslyFocused = typeof document !== "undefined" ? document.activeElement : null;
		setTimeout(() => panel?.focus(), 0);
		const handler = (e: KeyboardEvent) => {
			if (closeOnEsc && e.key === "Escape") close();
		};
		onKey = handler;
		document.addEventListener("keydown", handler);
	} else {
		if (onKey) {
			document.removeEventListener("keydown", onKey);
			onKey = null;
		}
		try {
			(previouslyFocused as HTMLElement | null)?.focus?.();
		} catch (e) {
			console.warn(e);
		}
	}

	onDestroy(() => {
		if (onKey) document.removeEventListener("keydown", onKey);
		if (container && container.parentNode) container.parentNode.removeChild(container);
	});
</script>

{#if open}
	<div bind:this={container} class="portal-host">
		<button
			type="button"
			class="modal-backdrop"
			aria-label="Close"
			on:click={() => closeOnBackdrop && close()}
			tabindex="-1"
		></button>

		<div
			class="modal-panel"
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel ?? title ?? "Dialog"}
			bind:this={panel}
			tabindex="0"
			on:click|stopPropagation
		>
			<header class="modal-header">
				{#if title}
					<div class="modal-title">{title}</div>
				{/if}
				<slot name="header" />
			</header>

			<div class="modal-body">
				<slot />
			</div>

			<footer class="modal-footer">
				<slot name="footer" />
			</footer>
		</div>
	</div>
{/if}

<style>
	.portal-host {
		position: fixed;
		inset: 0;
		z-index: 40000;
		pointer-events: auto;
	}
	.modal-backdrop {
		position: fixed;
		inset: 0;
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

	.modal-title {
		font-size: 16px;
		font-weight: 800;
		color: rgba(255, 255, 255, 0.95);
	}

	.modal-body {
		padding: 16px;
		flex: 1 1 auto;
		overflow: auto;
	}

	.modal-footer {
		padding: 12px 16px;
		border-top: 1px solid rgba(255, 255, 255, 0.02);
		display: flex;
		gap: 8px;
		justify-content: flex-end;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.01), transparent);
	}

	@media (max-width: 720px) {
		.modal-panel {
			width: calc(100% - 32px);
			max-height: calc(100vh - 64px);
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>

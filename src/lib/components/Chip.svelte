<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let variant: "default" | "muted" | "frosted" = "frosted";
	export let size: "md" | "sm" = "md";
	export let clickable: boolean = false;

	const dispatch = createEventDispatcher();

	function handleClick(event: MouseEvent) {
		dispatch("click", event);
	}
</script>

{#if clickable}
	<button type="button" class="chip {variant} {size} interactive" on:click={handleClick}>
		<slot />
	</button>
{:else}
	<span class="chip {variant} {size}">
		<slot />
	</span>
{/if}

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 999px;
		padding: 6px 12px;
		font-size: 13px;
		line-height: 1;
		user-select: none;
		white-space: nowrap;
		vertical-align: middle;
		/* frost */
		background-color: rgba(255, 255, 255, 0.01);
		backdrop-filter: saturate(120%) blur(2px);
	}

	.chip.md {
		padding: 8px 14px;
		font-size: 13px;
	}

	.chip.sm {
		padding: 6px 10px;
		font-size: 12px;
	}

	.chip.frosted,
	.chip.default {
		color: rgba(210, 220, 255, 0.75);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.008));
		background-color: rgba(255, 255, 255, 0.01);
		border: 1px solid rgba(180, 200, 255, 0.08);
	}

	.chip.muted {
		color: rgba(200, 200, 200, 0.86);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.005));
		background-color: rgba(255, 255, 255, 0.008);
		border: 1px solid rgba(255, 255, 255, 0.02);
	}

	.chip.interactive {
		cursor: pointer;
		transition:
			color 140ms ease,
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.chip.interactive:hover,
	.chip.interactive:focus {
		color: var(text-muted);
		background-color: rgba(255, 255, 255, 0.01);
		outline: none;
	}
</style>

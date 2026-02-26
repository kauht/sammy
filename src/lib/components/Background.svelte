<div class="bg-fixed">
	<div class="pattern"></div>
</div>
<div class="content">
	<slot />
</div>

<style>
	:global(:root) {
		--p: 0.05;
		--c: 60px;
		--d: 84.85px;
	}
	.bg-fixed {
		position: fixed;
		inset: 0;
		z-index: -10;
		background: radial-gradient(
			ellipse at 50% 50%,
			var(--surface-01),
			var(--bg-01) 50%,
			var(--bg-canvas)
		);
		pointer-events: none;
	}
	.pattern {
		position: fixed;
		inset: 0;
		background-image:
			repeating-linear-gradient(
				45deg,
				rgba(255, 255, 255, var(--p)) 0 1px,
				transparent 1px var(--c)
			),
			repeating-linear-gradient(
				-45deg,
				rgba(255, 255, 255, var(--p)) 0 1px,
				transparent 1px var(--c)
			);
		background-size: var(--d) var(--d);
		mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, #fff 5%, transparent 80%);
		pointer-events: none;
	}
</style>

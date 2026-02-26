<footer class="footer">
	<div class="separator"></div>
	<div class="items">
		<a class="link" href="https://github.com/kauht/" target="_blank" rel="noopener noreferrer"
			>Community</a
		>
		<span class="dot">•</span>
		<a class="link" href="https://github.com/kauht/sammy" target="_blank" rel="noopener noreferrer"
			>Source</a
		>
		<span class="dot">•</span>
		<a class="link" href="https://github.com/kauht/sammy" target="_blank" rel="noopener noreferrer"
			>Contribute</a
		>
	</div>
</footer>

<style>
	.footer {
		position: fixed;
		inset: auto 0 0;
		z-index: 0;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12px 0;
		user-select: none;
	}
	.separator {
		width: 40%;
		height: 1.5px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.12) 15%,
			rgba(255, 255, 255, 0.24) 50%,
			rgba(255, 255, 255, 0.12) 85%,
			transparent
		);
	}

	.items {
		display: flex;
		gap: 10px;
		margin: 12px auto 0;
		color: rgba(255, 255, 255, 0.4);
		font-size: 13px;
		max-width: var(--content-max-width);
		width: calc(100% - (var(--content-padding) * 2));
		justify-content: center;
		box-sizing: border-box;
	}

	.dot {
		opacity: 0.6;
		align-self: center;
	}

	.link {
		text-decoration: none;
		transition: color 160ms ease;
		padding: 4px 8px;
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.4);
	}
	.link:visited {
		color: rgba(255, 255, 255, 0.35);
	}
	.link:hover,
	.link:focus {
		color: rgba(255, 255, 255, 0.7);
		outline: none;
	}
	.link:focus-visible {
		box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.12);
		border-radius: 6px;
	}
</style>

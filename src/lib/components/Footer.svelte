<footer class="footer">
	<div class="separator"></div>
	<div class="items">
		<a class="link" href="https://github.com/kauht/" target="_blank">Community</a>
		<span class="dot">•</span>
		<a class="link" href="https://github.com/kauht/sammy" target="_blank">Source</a>
		<span class="dot">•</span>
		<a class="link" href="https://github.com/kauht/sammy" target="_blank">Contribute</a>
	</div>
</footer>

<style>
	.footer {
		position: fixed;
		inset: auto 0 0;
		z-index: 1;
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
		margin-top: 12px;
		color: rgba(255, 255, 255, 0.4);
		font-size: 13px;
	}

	.dot {
		opacity: 0.6;
	}

	.link {
		text-decoration: none;
		transition: color 160ms ease;
		padding: 4px 8px;
		border-radius: 6px;
	}

	.link:hover {
		color: rgba(255, 255, 255, 0.7);
	}
</style>

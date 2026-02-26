<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Work from './work/+page.svelte';
	import Notes from './notes/+page.svelte';
	import Blog from './blog/+page.svelte';
	import Info from './info/+page.svelte';

	// strongly-typed pages
	const pageOrder = ['info', 'work', 'blog', 'notes'] as const;
	type Page = (typeof pageOrder)[number];

	const validPages: Set<Page> = new Set(pageOrder);

	function getHashPage(): Page {
		if (typeof window === 'undefined') return 'info';
		const hash = window.location.hash.slice(1) as Page;
		return validPages.has(hash) ? hash : 'info';
	}

	let currentPage: Page = getHashPage();
	let direction = 1; // positive => forward, negative => backward

	function handleHashChange(): void {
		const hash = getHashPage();
		if (hash === currentPage) return;

		const prevIndex = pageOrder.indexOf(currentPage);
		const currIndex = pageOrder.indexOf(hash);
		direction = currIndex > prevIndex ? 1 : -1;
		currentPage = hash;

		// scroll to top when switching pages (presence check, no try/catch)
		if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
			// older browsers may ignore options but this is fine
			window.scrollTo({ top: 0, left: 0 });
		}
	}

	onMount(() => {
		window.addEventListener('hashchange', handleHashChange);
		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	});
</script>

<div class="page-wrapper">
	{#key currentPage}
		<div
			class="page-content"
			in:fly={{ x: direction * 60, duration: 200, easing: cubicOut }}
			out:fly={{ x: direction * -60, duration: 200, easing: cubicOut }}
		>
			{#if currentPage === 'info'}
				<Info />
			{:else if currentPage === 'work'}
				<Work />
			{:else if currentPage === 'blog'}
				<Blog />
			{:else if currentPage === 'notes'}
				<Notes />
			{/if}
		</div>
	{/key}
</div>

<style>
	.page-wrapper {
		display: grid;
	}

	.page-content {
		grid-area: 1 / 1;
	}

	.loading-text,
	.placeholder {
		color: rgba(255, 255, 255, 0.5);
		padding: 2rem;
		text-align: center;
	}

	.placeholder {
		font-size: 1rem;
	}
</style>

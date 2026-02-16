<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Work from './work/+page.svelte';
	import Notes from './notes/+page.svelte';
	import Info from './info/+page.svelte';

	const pageOrder = ['info', 'work', 'blog', 'notes'];
	const validPages = new Set(pageOrder);

	const initialPage = (() => {
		if (typeof window === 'undefined') return 'info';
		const hash = window.location.hash.slice(1);
		return validPages.has(hash) ? hash : 'info';
	})();

	let currentPage = $state(initialPage);
	let direction = $state(1);
	let notesData = $state<{ name: string; path: string; children?: any[] } | null>(null);

	function handleHashChange() {
		const hash = window.location.hash.slice(1) || 'info';
		if (validPages.has(hash) && hash !== currentPage) {
			window.scrollTo({ top: 0, behavior: 'instant' });
			const prevIndex = pageOrder.indexOf(currentPage);
			const currIndex = pageOrder.indexOf(hash);
			direction = currIndex > prevIndex ? 1 : -1;
			currentPage = hash;
		}
	}

	async function loadNotesData() {
		try {
			const response = await fetch('/api/notes/tree');
			notesData = await response.json();
		} catch {
			notesData = null;
		}
	}

	onMount(() => {
		window.addEventListener('hashchange', handleHashChange);
		loadNotesData();
		return () => window.removeEventListener('hashchange', handleHashChange);
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
				<div class="placeholder">Blog coming soon...</div>
			{:else if currentPage === 'notes'}
				{#if notesData}
					<Notes data={notesData} />
				{:else}
					<div class="loading-text">Loading notes...</div>
				{/if}
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

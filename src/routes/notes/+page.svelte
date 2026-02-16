<script lang="ts">
	type NoteFile = {
		id: string;
		name: string;
		path: string;
		type: 'file';
	};

	type NoteFolder = {
		id: string;
		name: string;
		path: string;
		type: 'folder';
		children: (NoteFile | NoteFolder)[];
	};

	type NoteItem = NoteFile | NoteFolder;

	type PageData = {
		tree: NoteItem[];
	};

	let { data } = $props<{ data: PageData }>();
	let expandedFolders = $state<string[]>([]);
	let selectedNote = $state<string | null>(null);
	let noteContent = $state<string>('');
	let loading = $state(false);

	function toggleFolder(id: string) {
		if (expandedFolders.includes(id)) {
			expandedFolders = expandedFolders.filter((f) => f !== id);
		} else {
			expandedFolders = [...expandedFolders, id];
		}
	}

	async function selectNote(path: string) {
		selectedNote = path;
		loading = true;
		noteContent = '';

		try {
			const response = await fetch(`/api/notes?path=${encodeURIComponent(path)}`);
			const result = await response.json();

			if (response.ok) {
				noteContent = result.content;
			} else {
				noteContent = '<p style="color: rgba(255,255,255,0.5);">Failed to load note</p>';
			}
		} catch {
			noteContent = '<p style="color: rgba(255,255,255,0.5);">Error loading note</p>';
		} finally {
			loading = false;
		}
	}
</script>

<div class="notes-layout">
	<aside class="sidebar">
		<div class="sidebar-header">
			<h2 class="sidebar-title">Obsidian Notes</h2>
		</div>
		<div class="tree">
			{#each data.tree as item (item.id)}
				{#if item.type === 'folder'}
					<div class="tree-item">
						<button
							class="folder-header"
							class:expanded={expandedFolders.includes(item.id)}
							onclick={() => toggleFolder(item.id)}
						>
							<svg
								class="chevron"
								class:rotated={expandedFolders.includes(item.id)}
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<polyline points="9 18 15 12 9 6" />
							</svg>
							<svg
								class="icon"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
								/>
							</svg>
							<span>{item.name}</span>
						</button>

						{#if expandedFolders.includes(item.id)}
							<div class="folder-children">
								{#each item.children as child (child.id)}
									{#if child.type === 'folder'}
										<button
											class="subfolder-header"
											class:expanded={expandedFolders.includes(child.id)}
											onclick={() => toggleFolder(child.id)}
										>
											<svg
												class="chevron"
												class:rotated={expandedFolders.includes(child.id)}
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<polyline points="9 18 15 12 9 6" />
											</svg>
											<svg
												class="icon"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<path
													d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
												/>
											</svg>
											<span>{child.name}</span>
										</button>

										{#if expandedFolders.includes(child.id)}
											<div class="subfolder-children">
												{#each child.children as note (note.id)}
													<button
														class="note-item"
														class:selected={selectedNote === note.path}
														onclick={() => selectNote(note.path)}
													>
														<svg
															class="icon"
															width="14"
															height="14"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
														>
															<path
																d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
															/>
															<polyline points="14 2 14 8 20 8" />
														</svg>
														<span>{note.name}</span>
													</button>
												{/each}
											</div>
										{/if}
									{:else}
										<button
											class="note-item"
											class:selected={selectedNote === child.path}
											onclick={() => selectNote(child.path)}
										>
											<svg
												class="icon"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
												<polyline points="14 2 14 8 20 8" />
											</svg>
											<span>{child.name}</span>
										</button>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<button
						class="note-item root-note"
						class:selected={selectedNote === item.path}
						onclick={() => selectNote(item.path)}
					>
						<svg
							class="icon"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
						</svg>
						<span>{item.name}</span>
					</button>
				{/if}
			{/each}
		</div>
	</aside>

	<main class="content">
		{#if selectedNote}
			<div class="note-viewer">
				<h1 class="note-title">{selectedNote.split('/').pop()?.replace('.md', '')}</h1>
				{#if loading}
					<div class="loading">
						<p>Loading...</p>
					</div>
				{:else if noteContent}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div class="note-content">
						{@html noteContent}
					</div>
				{:else}
					<div class="note-content">
						<p class="placeholder-text">No content</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="empty-state">
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
					<polyline points="14 2 14 8 20 8" />
				</svg>
				<p>Select a note from the sidebar</p>
			</div>
		{/if}
	</main>
</div>

<style>
	.notes-layout {
		display: flex;
		gap: 0;
		min-height: 70vh;
		margin: 0;
		border-radius: 16px;
		overflow: hidden;
		background: rgba(60, 60, 60, 0.4);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.32),
			inset 0 1px 1px rgba(255, 255, 255, 0.06);
		position: relative;
		z-index: 10;
	}

	.sidebar {
		width: 280px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		background: rgba(50, 50, 50, 0.5);
		backdrop-filter: blur(8px);
		border-right: 1px solid rgba(255, 255, 255, 0.08);
		overflow: hidden;
	}

	.sidebar-header {
		padding: 1.25rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.sidebar-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tree {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.tree::-webkit-scrollbar {
		width: 8px;
	}

	.tree::-webkit-scrollbar-track {
		background: transparent;
	}

	.tree::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}

	.tree::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.tree-item {
		margin-bottom: 0.25rem;
	}

	.folder-header,
	.subfolder-header,
	.note-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.75);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 120ms ease;
		text-align: left;
		width: 100%;
	}

	.folder-header:hover,
	.subfolder-header:hover,
	.note-item:hover {
		background: rgba(99, 99, 99, 0.25);
		color: rgba(255, 255, 255, 0.9);
	}

	.folder-header {
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
	}

	.folder-header.expanded {
		color: rgba(255, 255, 255, 0.95);
	}

	.note-item.selected {
		background: rgba(99, 99, 99, 0.35);
		color: rgba(255, 255, 255, 1);
	}

	.note-item.root-note {
		margin-left: 0;
	}

	.subfolder-header {
		font-size: 0.8125rem;
		padding-left: 1.5rem;
	}

	.folder-children {
		margin-left: 0.75rem;
		padding-left: 0.5rem;
		border-left: 1px solid rgba(255, 255, 255, 0.1);
		margin-top: 0.25rem;
	}

	.subfolder-children {
		margin-left: 0.75rem;
		padding-left: 0.5rem;
		border-left: 1px solid rgba(255, 255, 255, 0.08);
		margin-top: 0.25rem;
	}

	.note-item {
		font-size: 0.8125rem;
		padding-left: 2rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.icon {
		opacity: 0.65;
		flex-shrink: 0;
	}

	.chevron {
		opacity: 0.5;
		transition: transform 150ms ease;
		flex-shrink: 0;
	}

	.chevron.rotated {
		transform: rotate(90deg);
	}

	.content {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.content::-webkit-scrollbar {
		width: 10px;
	}

	.content::-webkit-scrollbar-track {
		background: transparent;
	}

	.content::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 5px;
	}

	.content::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		color: rgba(255, 255, 255, 0.4);
	}

	.empty-state svg {
		opacity: 0.5;
	}

	.empty-state p {
		font-size: 0.9375rem;
		margin: 0;
	}

	.note-viewer {
		padding: 2rem 3rem;
	}

	.note-title {
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
		margin: 0 0 2rem;
		letter-spacing: -0.02em;
	}

	.note-content {
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.7;
		font-size: 0.9375rem;
	}

	.note-content :global(h1),
	.note-content :global(h2),
	.note-content :global(h3) {
		color: rgba(255, 255, 255, 0.95);
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-weight: 600;
	}

	.note-content :global(h1) {
		font-size: 1.75rem;
	}

	.note-content :global(h2) {
		font-size: 1.5rem;
	}

	.note-content :global(h3) {
		font-size: 1.25rem;
	}

	.note-content :global(p) {
		margin-bottom: 1rem;
	}

	.note-content :global(code) {
		background: rgba(0, 0, 0, 0.3);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.875em;
		font-family: 'Courier New', monospace;
	}

	.note-content :global(pre) {
		background: rgba(0, 0, 0, 0.4);
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.note-content :global(pre code) {
		background: none;
		padding: 0;
	}

	.note-content :global(ul),
	.note-content :global(ol) {
		margin-left: 1.5rem;
		margin-bottom: 1rem;
	}

	.note-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.note-content :global(a) {
		color: rgba(255, 255, 255, 0.9);
		text-decoration: underline;
		text-decoration-color: rgba(255, 255, 255, 0.3);
		transition: all 150ms ease;
	}

	.note-content :global(a:hover) {
		text-decoration-color: rgba(255, 255, 255, 0.7);
	}

	.note-content :global(blockquote) {
		border-left: 3px solid rgba(255, 255, 255, 0.2);
		padding-left: 1rem;
		margin: 1rem 0;
		color: rgba(255, 255, 255, 0.7);
		font-style: italic;
	}

	.loading {
		color: rgba(255, 255, 255, 0.5);
		padding: 2rem;
	}

	.placeholder-text {
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
	}

	@media (max-width: 1024px) {
		.notes-layout {
			flex-direction: column;
			height: auto;
			min-height: 60vh;
		}

		.sidebar {
			width: 100%;
			max-height: 400px;
		}

		.note-viewer {
			padding: 1.5rem;
		}
	}
</style>

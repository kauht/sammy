<script lang="ts">
	const tech = [
		{ category: 'Languages', items: ['C/C++'] },
		{ category: 'Editors', items: ['Zed', 'Neovim'] },
		{ category: 'OS', items: ['Arch Linux', 'Windows 11'] },
		{ category: 'Hardware', items: ['i5-12600KF', 'RTX 3060 Ti', '32GB DDR4'] }
	];

	const interests = [
		'Compiler Design',
		'Systems Programming',
		'Operating Systems',
		'Assembly',
		'Graphics Programming',
		'Linear Algebra',
		'Data Structures & Algorithms',
		'Open Source'
	];

	const books = [
		{ title: "C++ A Beginner's Guide", file: "C++ A Beginner's Guide.pdf" },
		{
			title: "Computer Systems: A Programmer's Perspective",
			file: "Computer Systems A Programmer's Perspective.pdf"
		},
		{ title: 'Crafting Interpreters', file: 'Crafting Interpreters.pdf' },
		{ title: 'Fundamentals of Computer Graphics', file: 'Fundamentals of Computer Graphics.pdf' },
		{ title: 'Inside the Machine', file: 'Inside the Machine.pdf' },
		{ title: 'Learning the vi and Vim editors', file: 'Learning the vi and Vim editors.pdf' },
		{
			title: 'Modern X86 Assembly Language Programming',
			file: 'Modern X86 Assembly Language Programming.pdf'
		},
		{
			title: 'Operating Systems: Three Easy Pieces',
			file: 'Operating Systems Three Easy Pieces.pdf'
		},
		{ title: 'TCP-IP Illustrated', file: 'TCP-IP Illustrated.pdf' },
		{ title: 'The Ansi C Programming Language', file: 'The Ansi C Programming Language.pdf' },
		{ title: 'Windows Kernel Guide', file: 'Windows Kernel Guide.pdf' }
	];

	let emailCopied = $state(false);
	let showModal = $state(false);
	let activeTab = $state<'tech' | 'books'>('books');

	function copyEmail() {
		navigator.clipboard.writeText('me@sammy.sh');
		emailCopied = true;
		setTimeout(() => {
			emailCopied = false;
		}, 2000);
	}

	function openModal(tab: 'tech' | 'books') {
		activeTab = tab;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function downloadBook(file: string) {
		window.open(`/data/books/${file}`, '_blank');
	}
</script>

<div class="info-container">
	<div class="hero">
		<h1 class="name">Sammy</h1>
		<p class="tagline">Student • 17 • Rahh</p>
	</div>

	<div class="section">
		<h2 class="section-title">About</h2>
		<p class="about-text">
			I'm a student who likes low-level and systems programming. I enjoy solving problems that
			require deep technical understanding.
		</p>
	</div>

	<div class="section">
		<h2 class="section-title">Contact</h2>
		<div class="contact-list">
			<div class="contact-row">
				<span class="contact-label">Email</span>
				<button class="email-copy" on:click={copyEmail}>
					<span class="email-text">me [at] sammy [dot] sh</span>
					<span class="copy-hint">{emailCopied ? 'Copied!' : 'Click to copy'}</span>
				</button>
			</div>
			<div class="contact-row">
				<span class="contact-label">Discord</span>
				<span class="contact-value">@sammy or @yuhbayn</span>
			</div>
			<div class="contact-row">
				<span class="contact-label">GitHub</span>
				<a href="https://github.com/kauht" target="_blank" class="contact-link">@kauht</a>
			</div>
		</div>
	</div>

	<div class="section">
		<h2 class="section-title">Interests</h2>
		<div class="skills-container">
			{#each interests as interest (interest)}
				<div class="skill-tag">{interest}</div>
			{/each}
		</div>
	</div>

	<div class="section">
		<div class="more-section">
			<span class="more-label">More:</span>
			<button class="more-link" on:click={() => openModal('books')}>Books</button>
			<span class="more-separator">•</span>
			<button class="more-link" on:click={() => openModal('tech')}>Tech</button>
		</div>
	</div>
</div>

{#if showModal}
	<div class="modal-overlay" on:click={closeModal}>
		<div class="modal" on:click={(e) => e.stopPropagation()}>
			<div class="modal-tabs">
				<button
					class="modal-tab"
					class:active={activeTab === 'books'}
					on:click={() => (activeTab = 'books')}
				>
					Books
				</button>
				<button
					class="modal-tab"
					class:active={activeTab === 'tech'}
					on:click={() => (activeTab = 'tech')}
				>
					Tech
				</button>
			</div>

			<div class="modal-content">
				{#if activeTab === 'books'}
					<div class="books-list">
						{#each books as book}
							<button class="book-item" onclick={() => downloadBook(book.file)}>
								{book.title}
							</button>
						{/each}
					</div>
				{:else}
					<div class="tech-content">
						{#each tech as item (item.category)}
							<div class="tech-category-modal">
								<span class="tech-category-label-modal">{item.category}</span>
								<div class="tech-items-modal">
									{#each item.items as techItem}
										<span class="tech-item-modal">{techItem}</span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.info-container {
		max-width: 700px;
		margin: 0 auto;
		padding: 3rem 0;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 2rem 0;
	}

	.name {
		font-size: 2.5rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.tagline {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.5);
		text-align: center;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #fff;
		letter-spacing: -0.01em;
	}

	.about-text {
		font-size: 1rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.7);
	}

	.skills-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.skill-tag {
		padding: 0.625rem 1.25rem;
		background: rgba(99, 99, 99, 0.2);
		backdrop-filter: blur(6px);
		border-radius: 999px;
		font-size: 0.875rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
		box-shadow:
			inset 0 1px 4px rgba(0, 0, 0, 0.22),
			0 0 0 1px rgba(255, 255, 255, 0.15);
	}

	.tech-grid {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.tech-category {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tech-category-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.45);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tech-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.625rem;
	}

	.tech-item {
		padding: 0.5rem 1rem;
		background: rgba(60, 60, 60, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 8px;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.85);
	}

	.contact-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.contact-row {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 0.25rem 0;
	}

	.contact-label {
		font-size: 0.9375rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		min-width: 90px;
	}

	.contact-value {
		font-size: 1.0625rem;
		color: rgba(255, 255, 255, 0.85);
	}

	.contact-link {
		font-size: 1.0625rem;
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;
		transition: color 160ms ease;
	}

	.contact-link:hover {
		color: #fff;
		text-decoration: underline;
	}

	.email-copy {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 160ms ease;
	}

	.email-text {
		font-size: 1.0625rem;
		color: rgba(255, 255, 255, 0.85);
		font-family: 'Courier New', monospace;
		transition: color 160ms ease;
	}

	.email-copy:hover .email-text {
		color: #fff;
	}

	.copy-hint {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
		transition: color 160ms ease;
	}

	.email-copy:hover .copy-hint {
		color: rgba(255, 255, 255, 0.6);
	}

	.more-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.more-label {
		font-size: 1rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
	}

	.more-link {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.85);
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: color 160ms ease;
		text-decoration: underline;
		text-decoration-color: rgba(255, 255, 255, 0.2);
		text-underline-offset: 3px;
	}

	.more-link:hover {
		color: #fff;
		text-decoration-color: rgba(255, 255, 255, 0.5);
	}

	.more-separator {
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.875rem;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.modal {
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		width: 100%;
		max-width: 600px;
		height: 500px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
	}

	.modal-tabs {
		display: flex;
		gap: 0.25rem;
		padding: 1rem 1rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.modal-tab {
		padding: 0.625rem 1.25rem;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.45);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		border-radius: 6px 6px 0 0;
		transition: all 160ms ease;
	}

	.modal-tab.active {
		color: #fff;
		background: rgba(60, 60, 60, 0.4);
	}

	.modal-tab.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background: rgba(255, 255, 255, 0.2);
	}

	.modal-tab:hover {
		color: rgba(255, 255, 255, 0.7);
	}

	.modal-content {
		overflow-y: auto;
		padding: 1.5rem;
		flex: 1;
		min-height: 0;
	}

	.tech-content {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.tech-category-modal {
		display: flex;
		align-items: baseline;
		gap: 1rem;
	}

	.tech-category-label-modal {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		min-width: 90px;
		flex-shrink: 0;
	}

	.tech-items-modal {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.tech-item-modal {
		padding: 0.5rem 1rem;
		background: rgba(99, 99, 99, 0.2);
		backdrop-filter: blur(6px);
		border-radius: 999px;
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
		box-shadow:
			inset 0 1px 4px rgba(0, 0, 0, 0.22),
			0 0 0 1px rgba(255, 255, 255, 0.15);
	}

	.books-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.book-item {
		padding: 1rem 1.25rem;
		border: none;
		border-left: 2px solid rgba(255, 255, 255, 0.15);
		text-align: left;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.75);
		cursor: pointer;
		transition: all 160ms ease;
		border-radius: 2px;
	}

	.book-item:hover {
		background: rgba(60, 60, 60, 0.3);
		border-left-color: rgba(255, 255, 255, 0.4);
		color: rgba(255, 255, 255, 0.95);
		padding-left: 1.5rem;
	}

	@media (max-width: 768px) {
		.info-container {
			padding: 2rem 0;
			gap: 2.5rem;
		}

		.name {
			font-size: 2rem;
		}

		.modal-overlay {
			padding: 1rem;
		}

		.modal {
			height: 80vh;
			max-height: 600px;
		}

		.tech-category-modal {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.tech-category-label-modal {
			min-width: 0;
		}

		.more-section {
			flex-wrap: wrap;
		}
	}
</style>

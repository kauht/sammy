<script>
	import Chip from "$lib/components/Chip.svelte";
	import PersonalModal from "$lib/modals/PersonalModal.svelte";
	import BooksModal from "$lib/modals/BooksModal.svelte";
	import TechModal from "$lib/modals/TechModal.svelte";

	const tech = [
		{ category: "Languages", items: ["C/C++"] },
		{ category: "Editors", items: ["Zed", "Neovim"] },
		{ category: "OS", items: ["Arch Linux", "Windows 11"] },
		{ category: "Hardware", items: ["i5-12600KF", "RTX 3060 Ti", "32GB DDR4"] }
	];

	const interests = [
		"Open Source",
		"Data Structures & Algorithms",
		"Systems Programming",
		"Embedded Systems",
		"Compiler Design",
		"Assembly",
		"Graphics Programming",
		"Linear Algebra"
	];

	const books = [
		{ title: "C++ A Beginner's Guide", file: "C++ A Beginner's Guide.pdf" },
		{
			title: "Computer Systems: A Programmer's Perspective",
			file: "Computer Systems A Programmer's Perspective.pdf"
		},
		{ title: "Crafting Interpreters", file: "Crafting Interpreters.pdf" },
		{ title: "Fundamentals of Computer Graphics", file: "Fundamentals of Computer Graphics.pdf" },
		{ title: "Inside the Machine", file: "Inside the Machine.pdf" },
		{ title: "Learning the vi and Vim editors", file: "Learning the vi and Vim editors.pdf" },
		{
			title: "Modern X86 Assembly Language Programming",
			file: "Modern X86 Assembly Language Programming.pdf"
		},
		{
			title: "Operating Systems: Three Easy Pieces",
			file: "Operating Systems Three Easy Pieces.pdf"
		},
		{ title: "TCP-IP Illustrated", file: "TCP-IP Illustrated.pdf" },
		{ title: "The Ansi C Programming Language", file: "The Ansi C Programming Language.pdf" },
		{ title: "Windows Kernel Guide", file: "Windows Kernel Guide.pdf" }
	];

	const colors = ["#6A0DAD", "#B58EFF", "#000000", "#0D6BFF"];
	const genres = ["Dystopian", "Fantasy", "Fiction", "Technical"];
	const anime = [
		"Toradora!",
		"Horimiya",
		"Classroom of the Elite",
		"Forest of Piano",
		"Junji Ito Collection",
		"Heavenly Delusion",
		"A Silent Voice"
	];

	let emailCopied = false;

	let showPersonal = false;
	let showBooks = false;
	let showTech = false;

	function copyEmail() {
		void navigator.clipboard.writeText("me@sammy.sh");
		emailCopied = true;
		setTimeout(() => (emailCopied = false), 1800);
	}

	function openPersonal() {
		closeAll();
		showPersonal = true;
	}

	function openBooks() {
		closeAll();
		showBooks = true;
	}

	function openTech() {
		closeAll();
		showTech = true;
	}

	function downloadBook(file) {
		if (typeof window !== "undefined") window.open(`/books/${file}`, "_blank");
	}

	function closeAll() {
		showPersonal = false;
		showBooks = false;
		showTech = false;
	}
</script>

<section class="page">
	<header class="hero">
		<div class="hero-inner">
			<h1 class="title">Sammy</h1>
			<p class="subtitle">Student • 17 • Rahh</p>
		</div>
	</header>

	<main class="main">
		<section class="info-section">
			<h2 class="section-title">About</h2>
			<p class="lead">
				I'm a student who's focused on low-level and systems programming. I enjoy implementing
				solutions to problems that require deep technical understanding.
			</p>
		</section>

		<section class="info-section">
			<h2 class="section-title">Contact</h2>
			<dl class="contact-grid">
				<div class="contact-row">
					<dt class="contact-term">Email</dt>
					<dd class="contact-def">
						<button
							class="copy"
							type="button"
							on:click={copyEmail}
							aria-live="polite"
							aria-pressed={emailCopied}
						>
							<span class="mono">me [at] sammy [dot] sh</span>
							<span class="copied">{emailCopied ? "Copied!" : "Click to copy"}</span>
						</button>
					</dd>
				</div>

				<div class="contact-row">
					<dt class="contact-term">Discord</dt>
					<dd class="contact-def">@sammy or @yuhbayn</dd>
				</div>

				<div class="contact-row">
					<dt class="contact-term">GitHub</dt>
					<dd class="contact-def">
						<a
							class="link"
							href="https://github.com/kauht"
							target="_blank"
							rel="noopener noreferrer"
							style="color: rgba(180, 200, 255, 0.95) !important;"
						>
							@kauht
						</a>
					</dd>
				</div>
			</dl>
		</section>

		<section class="info-section">
			<h2 class="section-title">Interests</h2>
			<div class="chips">
				{#each interests as interest (interest)}
					<Chip>{interest}</Chip>
				{/each}
			</div>
		</section>

		<section class="info-section actions">
			<h2 class="section-title">More</h2>
			<div class="action-links">
				<button type="button" class="plain" on:click={openPersonal} aria-haspopup="dialog">
					Personal
				</button>

				<span class="dot">•</span>

				<button type="button" class="plain" on:click={openBooks} aria-haspopup="dialog">
					Books
				</button>

				<span class="dot">•</span>

				<button type="button" class="plain" on:click={openTech} aria-haspopup="dialog">
					Tech
				</button>
			</div>
		</section>
	</main>
</section>

{#if showPersonal}
	<PersonalModal {colors} {genres} {anime} on:close={() => (showPersonal = false)} />
{/if}

{#if showBooks}
	<BooksModal
		{books}
		on:close={() => (showBooks = false)}
		on:download={(e) => downloadBook(e.detail.file)}
	/>
{/if}

{#if showTech}
	<TechModal {tech} on:close={() => (showTech = false)} />
{/if}

<style>
	:global(body) {
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			"Segoe UI",
			Roboto,
			"Helvetica Neue",
			Arial;
		background: linear-gradient(180deg, var(--bg-01) 0%, var(--bg-02) 100%);
		color: var(--text);
	}

	.page {
		max-width: 860px;
		margin: 0 auto;
		padding: 48px 20px;
	}

	.hero {
		margin-bottom: 28px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
		padding-bottom: 18px;
	}

	.hero-inner {
		max-width: 820px;
	}

	.title {
		margin: 0;
		font-size: 36px;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
	}

	.subtitle {
		margin: 6px 0 0;
		color: rgba(234, 238, 242, 0.66);
		font-size: 16px;
	}

	.main {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
	}

	.info-section {
		padding: 6px 0 6px 0;
	}

	.section-title {
		display: inline-block;
		margin: 0 0 8px 0;
		font-size: 16px;
		font-weight: 700;
		color: #fff;
		position: relative;
		padding-bottom: 6px;
	}

	.section-title::after {
		content: "";
		display: block;
		height: 2px;
		width: 56px;
		border-radius: 2px;
		margin-top: 6px;
		background: linear-gradient(90deg, rgba(180, 200, 255, 0.14), rgba(140, 180, 255, 0.08));
	}

	.lead {
		margin: 0;
		color: rgba(234, 238, 242, 0.86);
		line-height: 1.6;
		font-size: 15px;
	}

	.contact-grid {
		margin: 0;
		padding: 0;
	}

	.contact-row {
		display: flex;
		gap: 12px;
		align-items: center;
		margin: 8px 0;
	}

	.contact-term {
		width: 110px;
		font-weight: 700;
		color: rgba(234, 238, 242, 0.78);
	}

	.contact-def {
		margin: 0;
		color: rgba(234, 238, 242, 0.9);
		font-size: 15px;
	}

	.copy {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		background: transparent;
		border: 0;
		padding: 0;
		border-radius: 0;
		cursor: pointer;
		color: inherit;
		font: inherit;
		font-size: 15px;
		font-weight: 600; /* slightly bolder main text */
		transition: color 140ms ease;
		appearance: none;
	}
	.copy:hover,
	.copy:focus {
		background: transparent;
		transform: none;
		box-shadow: none;
		outline: none;
	}
	.copy:active {
		transform: none;
		background: transparent;
	}

	.mono {
		font-family: "Courier New", monospace;
		font-size: 15px;
		font-weight: 600;
		color: var(--text);
	}

	.copied {
		color: rgba(255, 255, 255, 0.72);
		font-size: 11px;
		margin-left: 5px;
		transform: translateY(-3px);
		line-height: 1;
	}

	.chips {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		user-select: none;
	}

	.actions {
		margin-top: 6px;
	}

	.action-links {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 6px;
	}

	.plain {
		background: transparent;
		border: 0;
		color: rgba(180, 200, 255, 0.95);
		font-weight: 700;
		cursor: pointer;
		padding: 0;
		text-decoration: none;
		appearance: none;
		-webkit-appearance: none;
		transition: color 140ms ease;
	}
	.plain:hover,
	.plain:focus {
		color: rgba(180, 200, 255, 0.95);
		outline: none;
	}

	.dot {
		color: rgba(234, 238, 242, 0.5);
	}

	@media (max-width: 720px) {
		.page {
			padding: 28px 16px;
		}

		.title {
			font-size: 28px;
		}

		.contact-term {
			width: 92px;
		}
	}
</style>

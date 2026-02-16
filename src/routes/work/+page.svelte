<script lang="ts">
	import projectsData from '$data/projects.json';

	type Project = {
		name: string;
		type: 'WIP' | 'Complete' | 'Contribution';
		description: string;
		tags: string[];
		source: string;
		image: string;
	};

	const projects: Project[] = projectsData;

	const currentProjects = projects.filter((p) => p.type === 'WIP');
	const pastProjects = projects.filter((p) => p.type === 'Complete');
	const contributions = projects.filter((p) => p.type === 'Contribution');
</script>

<div class="work-container">
	<section class="work-section">
		<h1 class="section-title">Currently Working On</h1>
		<div class="projects-grid">
			{#each currentProjects as project (project.name)}
				<div class="project-card">
					<div class="project-thumbnail">
						{#if project.image}
							<img src={project.image} alt={project.name} class="project-image" />
						{:else}
							<div class="placeholder-image">
								<span class="project-icon">{project.name[0]}</span>
							</div>
						{/if}
					</div>
					<div class="project-content">
						<div class="project-header">
							<h2 class="project-name">{project.name}</h2>
							<a
								href={project.source}
								target="_blank"
								rel="noopener noreferrer"
								class="source-link"
							>
								source
							</a>
						</div>
						<p class="project-description">{project.description}</p>
						<div class="tech-stack">
							{#each project.tags as tag (tag)}
								<span class="tech-tag">{tag}</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="work-section">
		<h1 class="section-title">Past Work</h1>
		<div class="projects-grid">
			{#each pastProjects as project (project.name)}
				<div class="project-card">
					<div class="project-thumbnail">
						{#if project.image}
							<img src={project.image} alt={project.name} class="project-image" />
						{:else}
							<div class="placeholder-image">
								<span class="project-icon">{project.name[0]}</span>
							</div>
						{/if}
					</div>
					<div class="project-content">
						<div class="project-header">
							<h2 class="project-name">{project.name}</h2>
							<a
								href={project.source}
								target="_blank"
								rel="noopener noreferrer"
								class="source-link"
							>
								source
							</a>
						</div>
						<p class="project-description">{project.description}</p>
						<div class="tech-stack">
							{#each project.tags as tag (tag)}
								<span class="tech-tag">{tag}</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="work-section">
		<h1 class="section-title">Contributions</h1>
		<div class="projects-grid">
			{#each contributions as project (project.name)}
				<div class="project-card">
					<div class="project-thumbnail">
						{#if project.image}
							<img src={project.image} alt={project.name} class="project-image" />
						{:else}
							<div class="placeholder-image">
								<span class="project-icon">{project.name[0]}</span>
							</div>
						{/if}
					</div>
					<div class="project-content">
						<div class="project-header">
							<h2 class="project-name">{project.name}</h2>
							<a
								href={project.source}
								target="_blank"
								rel="noopener noreferrer"
								class="source-link"
							>
								source
							</a>
						</div>
						<p class="project-description">{project.description}</p>
						<div class="tech-stack">
							{#each project.tags as tag (tag)}
								<span class="tech-tag">{tag}</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	.work-container {
		padding: 2rem 0;
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}

	.work-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: #fff;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.project-card {
		background: rgba(60, 60, 60, 0.5);
		backdrop-filter: blur(12px);
		border-radius: 16px;
		overflow: hidden;
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.32),
			inset 0 1px 1px rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.06);
		display: flex;
		flex-direction: column;
	}

	.project-thumbnail {
		width: 100%;
		aspect-ratio: 16 / 9;
		background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.placeholder-image {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08), transparent 60%);
	}

	.project-icon {
		font-size: 4rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.15);
		user-select: none;
	}

	.project-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.project-content {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		flex: 1;
	}

	.project-header {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	.project-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: #fff;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.source-link {
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.5);
		text-decoration: none;
		transition: color 150ms ease;
		white-space: nowrap;
	}

	.source-link:hover {
		color: rgba(255, 255, 255, 0.85);
		text-decoration: underline;
	}

	.project-description {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.7);
		margin: 0;
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 0.5rem;
	}

	.tech-tag {
		font-size: 0.75rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.8);
		background: rgba(99, 99, 99, 0.3);
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		letter-spacing: 0.02em;
	}

	@media (max-width: 768px) {
		.projects-grid {
			grid-template-columns: 1fr;
		}

		.section-title {
			font-size: 1.5rem;
		}

		.work-container {
			gap: 3rem;
		}
	}
</style>

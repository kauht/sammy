import { readFile } from 'fs/promises';
import { join } from 'path';
import { json } from '@sveltejs/kit';
import { marked } from 'marked';

const NOTES_DIR = 'C:\\Users\\sam\\Documents\\Obsidian Vault\\5 - Main Notes';

export async function GET({ url }) {
	const notePath = url.searchParams.get('path');

	if (!notePath) {
		return json({ error: 'No path provided' }, { status: 400 });
	}

	try {
		const fullPath = join(NOTES_DIR, notePath);
		const content = await readFile(fullPath, 'utf-8');
		const html = await marked(content);

		return json({
			content: html,
			path: notePath
		});
	} catch (error) {
		console.error('Error reading note:', error);
		return json({ error: 'Note not found' }, { status: 404 });
	}
}

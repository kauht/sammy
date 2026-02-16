import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

const NOTES_DIR = 'C:\\Users\\sam\\Documents\\Obsidian Vault\\5 - Main Notes';

interface NoteFile {
	id: string;
	name: string;
	path: string;
	type: 'file';
}

interface NoteFolder {
	id: string;
	name: string;
	path: string;
	type: 'folder';
	children: (NoteFile | NoteFolder)[];
}

type NoteItem = NoteFile | NoteFolder;

async function buildFileTree(dirPath: string, parentPath = ''): Promise<NoteItem[]> {
	try {
		const entries = await readdir(dirPath);
		const items: NoteItem[] = [];

		for (const entry of entries) {
			const fullPath = join(dirPath, entry);
			const relativePath = parentPath ? `${parentPath}/${entry}` : entry;

			try {
				const stats = await stat(fullPath);

				if (stats.isDirectory()) {
					const children = await buildFileTree(fullPath, relativePath);
					items.push({
						id: relativePath,
						name: entry,
						path: relativePath,
						type: 'folder',
						children
					});
				} else if (entry.endsWith('.md')) {
					items.push({
						id: relativePath,
						name: entry.replace('.md', ''),
						path: relativePath,
						type: 'file'
					});
				}
			} catch (err) {
				console.error(`Error processing ${entry}:`, err);
			}
		}

		return items.sort((a, b) => {
			if (a.type === 'folder' && b.type === 'file') return -1;
			if (a.type === 'file' && b.type === 'folder') return 1;
			return a.name.localeCompare(b.name);
		});
	} catch (err) {
		console.error('Error reading directory:', err);
		return [];
	}
}

export async function load() {
	const tree = await buildFileTree(NOTES_DIR);

	return {
		tree
	};
}

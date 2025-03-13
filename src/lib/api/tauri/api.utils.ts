import { open } from '@tauri-apps/plugin-shell'

export async function openLink(url: string): Promise<void> {
	if (url) {
		await open(url)
	}
}

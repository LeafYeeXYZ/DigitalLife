import { invoke } from '@tauri-apps/api/core'
import { save as _save } from '@tauri-apps/plugin-dialog'
import { load } from '@tauri-apps/plugin-store'

const db = await load('data.json')

export function get(
	key: 'long_term_memory',
): Promise<LongTermMemory[] | undefined>
export function get(
	key: 'short_term_memory',
): Promise<ShortTermMemory[] | undefined>
export function get(
	key: 'archived_memory',
): Promise<ArchivedMemory[] | undefined>
export function get(key: 'last_used_token'): Promise<number | undefined>
export function get(
	key: 'audios_cache',
): Promise<{ timestamp: number; audio: Uint8Array }[] | undefined>
export function get(
	key: 'think_cache',
): Promise<{ timestamp: number; content: string }[] | undefined>
export function get(key: StoreKeys): Promise<string | undefined>
export function get(key: StoreKeys): Promise<unknown> {
	return db.get(key)
}

export function set(
	key: 'long_term_memory',
	value: LongTermMemory[],
): Promise<void>
export function set(
	key: 'short_term_memory',
	value: ShortTermMemory[],
): Promise<void>
export function set(
	key: 'archived_memory',
	value: ArchivedMemory[],
): Promise<void>
export function set(
	key: 'last_used_token',
	value: number | undefined,
): Promise<void>
export function set(
	key: 'audios_cache',
	value: { timestamp: number; audio: Uint8Array }[],
): Promise<void>
export function set(
	key: 'think_cache',
	value: { timestamp: number; content: string }[],
): Promise<void>
export function set(key: StoreKeys, value: string | undefined): Promise<void>
export async function set(key: StoreKeys, value: unknown): Promise<void> {
	await db.set(key, value)
	// await db.save()
	return
}

export async function save(data: string): Promise<string> {
	const path = await _save({
		title: '保存记忆',
		defaultPath: 'memory.json',
		filters: [
			{ name: 'JSON', extensions: ['json'] },
			{ name: 'TXT', extensions: ['txt'] },
		],
	})
	if (!path) throw new Error('取消保存')
	return invoke('save_memory', { path, data })
}

import emojiRegex from 'emoji-regex'
import { toBase64 } from '../../utils.ts'
const emoji = emojiRegex()

const speak_f5tts = async (
	text: string,
	endpoint: string,
): Promise<{ audio: Uint8Array }> => {
	try {
		const t = text.replace(new RegExp(emoji, 'g'), '')
		if (t.length === 0) {
			throw new Error('文本为空')
		}
		const refText: string = await (await fetch('/tts/luoshaoye.txt')).text()
		const refAudio: Uint8Array = new Uint8Array(
			await (await fetch('/tts/luoshaoye.wav')).arrayBuffer(),
		)
		const formData = new FormData()
		formData.append('ref_text', refText)
		formData.append('gen_text', t)
		formData.append('model', 'f5-tts')
		formData.append('audio', new Blob([refAudio], { type: 'audio/wav' }))
		const res = await fetch(endpoint, {
			method: 'POST',
			body: formData,
		})
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText}`)
		}
		const audio = new Uint8Array(await res.arrayBuffer())
		return { audio }
	} catch (e) {
		throw new Error(`F5 TTS API 错误: ${e instanceof Error ? e.message : e}`)
	}
}
const test_f5tts = async (endpoint: string): Promise<boolean> => {
	if (sessionStorage.getItem('f5_tts_test') === 'ok') {
		return true
	}
	try {
		const refText: string = await (await fetch('/tts/luoshaoye.txt')).text()
		const refAudio: Uint8Array = new Uint8Array(
			await (await fetch('/tts/luoshaoye.wav')).arrayBuffer(),
		)
		const formData = new FormData()
		formData.append('ref_text', refText)
		formData.append('gen_text', '你好')
		formData.append('model', 'f5-tts')
		formData.append('audio', new Blob([refAudio], { type: 'audio/wav' }))
		const res = await fetch(endpoint, {
			method: 'POST',
			body: formData,
		})
		if (res.status === 200) {
			sessionStorage.setItem('f5_tts_test', 'ok')
			return true
		}
		throw new Error(`HTTP ${res.status} ${res.statusText}`)
	} catch (e) {
		throw new Error(
			`F5 TTS API 测试失败: ${e instanceof Error ? e.message : e}`,
		)
	}
}

const speak_fish = async (
	text: string,
	endpoint: string,
): Promise<{ audio: Uint8Array }> => {
	try {
		const t = text.replace(new RegExp(emoji, 'g'), '')
		if (t.length === 0) {
			throw new Error('文本为空')
		}
		const url = endpoint + '/v1/tts'
		const refText: string = await (await fetch('/tts/luoshaoye.txt')).text()
		const refAudio: string = toBase64(
			await (await fetch('/tts/luoshaoye.wav')).arrayBuffer(),
		)
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				t,
				use_memory_cache: 'on',
				references: [
					{
						audio: refAudio,
						text: refText,
					},
				],
			}),
		})
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText}`)
		}
		const audio = new Uint8Array(await res.arrayBuffer())
		return { audio }
	} catch (e) {
		throw new Error(
			`Fish Speech API 错误: ${e instanceof Error ? e.message : e}`,
		)
	}
}
const test_fish = async (endpoint: string): Promise<boolean> => {
	if (sessionStorage.getItem('fish_speech_test') === 'ok') {
		return true
	}
	try {
		const url = endpoint + '/v1/tts'
		const refText: string = await (await fetch('/tts/luoshaoye.txt')).text()
		const refAudio: string = toBase64(
			await (await fetch('/tts/luoshaoye.wav')).arrayBuffer(),
		)
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				text: '你好',
				use_memory_cache: 'on',
				references: [
					{
						audio: refAudio,
						text: refText,
					},
				],
			}),
		})
		if (res.status === 200) {
			sessionStorage.setItem('fish_speech_test', 'ok')
			return true
		}
		throw new Error(`HTTP ${res.status} ${res.statusText}`)
	} catch (e) {
		throw new Error(
			`Fish Speech API 测试失败: ${e instanceof Error ? e.message : e}`,
		)
	}
}

export const speakApiList: SpeakApiList = [
	{ name: '关闭', api: null },
	{
		name: 'F5 TTS API',
		api: ({ f5TtsEndpoint }) => ({
			api: (text: string) => speak_f5tts(text, f5TtsEndpoint),
			test: () => test_f5tts(f5TtsEndpoint),
		}),
	},
	{
		name: 'Fish Speech API',
		api: ({ fishSpeechEndpoint }) => ({
			api: (text: string) => speak_fish(text, fishSpeechEndpoint),
			test: () => test_fish(fishSpeechEndpoint),
		}),
	},
]

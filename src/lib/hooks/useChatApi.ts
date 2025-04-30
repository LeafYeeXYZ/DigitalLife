import OpenAI from 'openai'
import { create } from 'zustand'
import { get, set } from '../utils.ts'

type API = {
	chat: ChatApi
	testChat: ChatApiTest
	openaiEndpoint: string
	setOpenaiEndpoint: (url?: string) => Promise<void>
	openaiApiKey: string
	setOpenaiApiKey: (key?: string) => Promise<void>
	openaiModelName: string
	setOpenaiModelName: (name?: string) => Promise<void>
	usedToken: number // -1 means unknown
	setUsedToken: (token: number | undefined) => Promise<void>

	thinkCache: { timestamp: number; content: string }[]
	setThinkCache: (
		value: { timestamp: number; content: string }[],
	) => Promise<void>
	addThinkCache: (value: {
		timestamp: number
		content: string
	}) => Promise<void>
}

const DEFAULT_OPENAI_ENDPOINT = 'http://localhost:11434/v1/'
const DEFAULT_OPENAI_API_KEY = 'ollama'
const DEFAULT_OPENAI_MODEL_NAME = 'qwen2.5:7b'

const localUsedToken = await get('last_used_token')
const localThinkCache = await get('think_cache')
const defaultUsedToken = localUsedToken ? Number(localUsedToken) : -1
const defaultOpenaiEndpoint =
	(await get('openai_endpoint')) ?? DEFAULT_OPENAI_ENDPOINT
const defaultOpenaiApiKey =
	(await get('openai_api_key')) ?? DEFAULT_OPENAI_API_KEY
const defaultOpenaiModelName =
	(await get('openai_model_name')) ?? DEFAULT_OPENAI_MODEL_NAME
const defaultChatApi = new OpenAI({
	baseURL: defaultOpenaiEndpoint,
	apiKey: defaultOpenaiApiKey,
	dangerouslyAllowBrowser: true,
})

export const useChatApi = create<API>()((setState, getState) => ({
	thinkCache: localThinkCache ?? [],
	setThinkCache: async (value) => {
		setState({ thinkCache: value })
		await set('think_cache', value)
	},
	addThinkCache: async (value) => {
		const { thinkCache } = getState()
		const newCache = [value, ...thinkCache]
		setState({ thinkCache: newCache })
		await set('think_cache', newCache)
	},
	chat: defaultChatApi,
	usedToken: defaultUsedToken,
	setUsedToken: async (token) => {
		setState({ usedToken: token })
		await set('last_used_token', token ?? -1)
		return
	},
	openaiEndpoint: defaultOpenaiEndpoint,
	setOpenaiEndpoint: async (url) => {
		const { openaiApiKey } = getState()
		const v = url || DEFAULT_OPENAI_ENDPOINT
		setState({
			openaiEndpoint: v,
			chat: new OpenAI({
				baseURL: v,
				apiKey: openaiApiKey,
				dangerouslyAllowBrowser: true,
			}),
		})
		await set('openai_endpoint', v)
		sessionStorage.removeItem('openai_chat_test')
		return
	},
	openaiApiKey: defaultOpenaiApiKey,
	setOpenaiApiKey: async (key) => {
		const { openaiEndpoint } = getState()
		const v = key || DEFAULT_OPENAI_API_KEY
		setState({
			openaiApiKey: v,
			chat: new OpenAI({
				baseURL: openaiEndpoint,
				apiKey: v,
				dangerouslyAllowBrowser: true,
			}),
		})
		await set('openai_api_key', v)
		sessionStorage.removeItem('openai_chat_test')
		return
	},
	openaiModelName: defaultOpenaiModelName,
	setOpenaiModelName: async (name) => {
		const v = name || DEFAULT_OPENAI_MODEL_NAME
		setState({ openaiModelName: v })
		await set('openai_model_name', v)
		sessionStorage.removeItem('openai_chat_test')
		return
	},
	testChat: async () => {
		if (sessionStorage.getItem('openai_chat_test') === 'ok') {
			return true
		}
		const { chat } = getState()
		await chat.models.list().catch((err) => {
			if (err.message === 'Connection error.') {
				throw new Error('推理模型未启动')
			}
			throw err
		})
		sessionStorage.setItem('openai_chat_test', 'ok')
		return true
	},
}))

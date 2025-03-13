import { create } from 'zustand'
import { get, set } from '../utils.ts'

type API = {
	vectorDimension: number
	setVectorDimension: (dimension?: number) => Promise<void>
	jinaEndpoint: string
	setJinaEndpoint: (url?: string) => Promise<void>
	jinaApiKey: string
	setJinaApiKey: (key?: string) => Promise<void>
	vectorApi: (text: string) => Promise<number[]>
}

const DEFAULT_VECTOR_DIMENSION = 512
const DEFAULT_JINA_ENDPOINT = 'https://api.jina.ai/v1/embeddings'

const localVectorDimension = await get('vector_dimension')
const defaultVectorDimension = localVectorDimension
	? Number(localVectorDimension)
	: DEFAULT_VECTOR_DIMENSION
const defaultJinaEndpoint =
	(await get('jina_endpoint')) ?? DEFAULT_JINA_ENDPOINT
const defaultJinaApiKey = (await get('jina_api_key')) ?? ''

export const useVectorApi = create<API>()((setState, getState) => ({
	vectorApi: async (text) => {
		const { vectorDimension, jinaEndpoint, jinaApiKey } = getState()
		if (!jinaApiKey || !jinaEndpoint || !vectorDimension) {
			throw new Error('未设置 Jina API 相关信息')
		}
		const response = await fetch(jinaEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${jinaApiKey}`,
			},
			body: JSON.stringify({
				model: 'jina-embeddings-v3',
				task: 'text-matching',
				late_chunking: false,
				dimensions: vectorDimension,
				embedding_type: 'float',
				input: [text],
			}),
		})
		const data = await response.json()
		return data.data[0].embedding
	},
	vectorDimension: defaultVectorDimension,
	setVectorDimension: async (dimension) => {
		setState({ vectorDimension: dimension ?? DEFAULT_VECTOR_DIMENSION })
		await set('vector_dimension', dimension?.toString())
		return
	},
	jinaEndpoint: defaultJinaEndpoint,
	setJinaEndpoint: async (url) => {
		setState({ jinaEndpoint: url || DEFAULT_JINA_ENDPOINT })
		await set('jina_endpoint', url)
		return
	},
	jinaApiKey: defaultJinaApiKey,
	setJinaApiKey: async (key) => {
		setState({ jinaApiKey: key ?? '' })
		await set('jina_api_key', key)
		return
	},
}))

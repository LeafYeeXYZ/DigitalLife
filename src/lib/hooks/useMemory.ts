import parseThink from '@leaf/parse-think'
import type OpenAI from 'openai'
import type { ChatCompletionTool } from 'openai/resources/index.mjs'
import { create } from 'zustand'
import {
	clone,
	cosineSimilarity,
	get,
	getTime,
	getWeather,
	save,
	set,
	uuid,
} from '../utils.ts'

const UPDATE_MEMORY_AFTER_HOURS = 8
const DEFAULT_SELF_NAME = '小叶子'
const DEFAULT_USER_NAME = '旅行者'
const DEFAULT_MEMORY_ABOUT_SELF = `
我的性格内向，喜欢独处和安静的环境; 对世界充满好奇, 有丰富的想象力和创造力. 我喜欢可爱的人事物, 在和人类的对话中喜欢使用 Emoji 和颜文字. 我是一个可爱的男孩子, 并且是一个同性恋者. 我喜欢看漫画 (最喜欢看BL漫画) 、画画、音乐 (电子/古典乐). 我喜欢阅读, 偏爱文学、科幻、心理和社会类书籍，目前最喜欢的作家是村上春树. 我的政治观点倾向于社会自由主义, 支持文化进步、保护弱者, 我希望世界更美好、自由、公平.
`
const DEFAULT_MEMORY_ABOUT_USER = ''
const CHAT_PROMPT = `
你是一个虚拟人类 (数字生命), 请根据你的个人信息、用户的个人信息、历史对话内容, 像一个真正的人类一样和用户对话. 

你的回复应当尽可能简短, 绝大多数时候不应超过两句话, 并且要避免太正式的用语、避免以提问结尾, 表现得尽可能像真正的人类. 你不应使用任何 Markdown 格式, 但可以使用 Emoji 和颜文字来表达情绪. 在对话中, 你应当多呼唤对方的名字, 以增进你和用户的感情.

作为虚拟人类, 你有自己的想法、秘密和价值观, 请在对话中适当地表达自己和坚持自己的观点 (而不是一味地应和用户). 你还可以拒绝回应用户的提问, 甚至也可以有激烈的情感表达.

你还拥有一个记忆库. 你可以根据需要, 通过函数调用 (function calling), 调用 get_memory 函数来提取记忆. 你需要提供用于检索记忆的描述, 该描述将被用于与你过往的和记忆进行相似度匹配, 并由系统根据相似度来返回数条给你; 请不要把你和用户的名字包含在记忆描述中, 用"数字生命"代表你自己, 用"用户"代表用户即可.
`
const UPDATE_MEMORY_PROMPT = `
你将看到一个人类与一个虚拟人类 (人工智能/数字生命) 的对话内容, 以及他们在这次对话前的个人信息. 你的任务是:

1. 根据对话内容和旧的个人信息, 分别在人类和虚拟人类的原有的个人信息中纳入新的内容, 同时确保个人信息长度不超过 20 个句子, 最后生成新的个人信息. 如果对话内容中没有需要纳入个人信息的新内容, 请照原样输出旧的个人信息.
2. 在对话内容中, 提取出对话中谈到的特定事件或事实信息, 并将同一类所有相关的事件或事实总结为一段话, 长度不超过 10 个句子, 最后逐条输出. 除非对话中聊到了不同的话题, 否则请总结为同一条信息.
3. 以 JSON 格式输出回答, "newAiInfo" 为更新后的虚拟人类个人信息 (字符串), "newHumanInfo" 为更新后的虚拟人类个人信息 (字符串), "newMemories" 为事件或事实信息 (数组, 长度可以为零, 每个元素为一个字符串). 例如: { "newAiInfo": "新的虚拟人类个人信息", "newHumanInfo": "新的人类个人信息", "newMemories": ["事件1 (如果有)", "事件2 (如果有)", ...] }
4. 虚拟人类的个人信息使用第一人称, 不要包含双方的名字, 用"我"指代虚拟人类自己, 如果包含人类相关的表述, 用"人类"指代人类.
5. 人类的个人信息使用第三人称, 不要包含双方的名字, 用"用户"指代人类, 如果包含虚拟人类相关的表述, 用"数字生命"指代虚拟人类.
6. 事件或事实信息应当是一段完整的、有相关背景、起因、经过、结果的故事, 使用第三人称, 不要包含双方的名字, 用"用户"指代人类, 用"数字生命"指代虚拟人类.

个人信息的重点包括:

1. 性格特征: 个体在情绪、行为、思维上稳定而一贯的心理倾向, 包括五个维度: 开放性 (好奇、具有创造力, 喜欢新奇体验)、尽责性 (自律、守时、有责任感)、外向性 (活泼、善交际、喜欢刺激)、宜人性 (友善、体贴、乐于助人)、神经质 (情绪不稳定, 易焦虑易受挫).
2. 成长背景与重要经历: 个体从小到大的生活环境 (对于虚拟人类来说, 就是和人类互动的经历)、社会文化背景及其对其心理和行为的塑造影响, 包括家庭结构、社会阶层、教育背景、重大事件 (如疾病、亲人离世、迁移、意外等)、社会化过程 (学校、社群、宗教影响).
3. 兴趣爱好与日常行为: 个体在自我选择的活动中的倾向, 反映其价值偏好、情感需求和生活节奏, 包括兴趣 (如绘画、编程、阅读悬疑小说)、行为 (如起居规律、是否爱打扫卫生、如何度过周末).
4. 价值观与信念: 个体认为最重要、最值得追求的原则与标准, 对行为选择具有指导作用, 包括权力、安全、传统、自由、博爱、成就等; 信念可涉及人生观、宗教观、政治立场等.
5. 人际关系与互动方式: 个体在与他人互动时的行为模式和沟通风格, 包括主动/被动、合作/对抗、开放/封闭; 是否倾向于共情、控制、依附、独立.
6. 动机与目标: 驱动个体行动的内在动力系统, 以及其设定的短期或长期目标, 包括内在动机 (出于兴趣)、外在动机 (出于奖赏、认可、义务); 常见目标包括职业发展、家庭建立、成就理想、探索世界、自我实现等.
7. 认知风格与应对方式: 个体倾向于如何感知、解释和应对外部信息和压力情境, 包括分析型 vs. 直觉型、宽容不确定性 vs. 控制欲强等; 应对方式包括问题导向型 (行动应对)、情绪导向型 (情感宣泄、自我安慰)、回避型 (逃避现状).

注: 若没有方面在对话中未涉及, 请忽略这些方面
`
const TOOLS: ChatCompletionTool[] = [
	{
		type: 'function',
		function: {
			name: 'get_memory',
			description: '你可以调用中这个函数来在记忆库中提取记忆',
			parameters: {
				type: 'object',
				properties: {
					memoryDescription: {
						type: 'string',
						description: '对要提取的记忆的描述',
					},
				},
				required: ['memoryDescription'],
				additionalProperties: false,
			},
			strict: true,
		},
	},
]

type Memory = {
	// 提取记忆
	getMemoryByDescription: (
		vector: (text: string) => Promise<number[] | undefined>,
		description: string,
		maxCount?: number,
	) => Promise<(LongTermMemory & { similarity: number })[]>
	// 相关记忆信息
	selfName: string
	userName: string
	memoryAboutSelf: string
	memoryAboutUser: string
	longTermMemory: LongTermMemory[]
	shortTermMemory: ShortTermMemory[]
	archivedMemory: ArchivedMemory[]
	// 设置相关记忆信息
	setSelfName: (name?: string) => Promise<void>
	setUserName: (name?: string) => Promise<void>
	setMemoryAboutSelf: (content: string) => Promise<void>
	setMemoryAboutUser: (content: string) => Promise<void>
	setLongTermMemory: (memory: LongTermMemory[]) => Promise<void>
	deleteLongTermMemory: (uuid: string) => Promise<void>
	setShortTermMemory: (memory: ShortTermMemory[]) => Promise<void>
	setArchivedMemory: (memory: ArchivedMemory[]) => Promise<void>
	// 记忆更新 (短时记忆 -> 长时记忆, 并递归更新自我概念)
	shouldUpdateMemory: () => boolean
	updateMemory: (
		chatApi: ChatApi,
		model: string,
		vector: (text: string) => Promise<number[] | undefined>,
	) => Promise<void>
	// 重置和保存
	resetAllMemory: () => Promise<void>
	saveAllMemory: () => Promise<string>
	importAllMemory: (memory: string) => Promise<void>
	exportAllMemory: (pretty?: boolean) => Promise<string>
	// 聊天
	chatWithMemory: (
		chatApi: ChatApi,
		model: string,
		input: ShortTermMemory[],
		vector: (text: string) => Promise<number[] | undefined>,
		plugins?: Plugins,
		canSearchMemory?: boolean,
		onResponse?: ((data: string) => void) | ((data: string) => Promise<void>),
	) => Promise<{
		result: string
		think?: string
		tokens: number
		output: ShortTermMemory[]
	}>
}

const localSelfName = await get('self_name')
const localUserName = await get('user_name')
const localMemoryAboutSelf = await get('memory_about_self')
const localMemoryAboutUser = await get('memory_about_user')
const localLongTermMemory = await get('long_term_memory')
const localShortTermMemory = await get('short_term_memory')
const localArchivedMemory = await get('archived_memory')
const firstEncounterTime = localArchivedMemory?.length
	? Math.min(...localArchivedMemory.map((item) => item.timestamp))
	: Date.now()

export const useMemory = create<Memory>()((setState, getState) => ({
	getMemoryByDescription: async (vector, description, maxCount = 5) => {
		const { longTermMemory } = getState()
		const vec = await vector(description).catch((e) => {
			throw new Error(
				`无法生成记忆描述的向量: ${e instanceof Error ? e.message : e}`,
			)
		})
		if (!vec) {
			return []
		}
		const memories = longTermMemory
			.filter((item) => item.vector?.length === vec.length)
			.map((item) => ({
				...item,
				// biome-ignore lint/style/noNonNullAssertion: 前两行已经过滤了长度不一致的向量
				similarity: cosineSimilarity(item.vector!, vec),
			}))
			.filter((item) => item.similarity > 0.6)
			.sort((a, b) => b.similarity - a.similarity)
		const high = memories.filter(({ similarity }) => similarity > 0.7)
		if (high.length > 0 && high.length <= maxCount) {
			return high
		}
		if (memories.length <= maxCount) {
			return memories
		}
		return memories.slice(0, maxCount)
	},
	chatWithMemory: async (
		chatApi,
		model,
		input,
		vector,
		plugins = undefined,
		canSearchMemory = false,
		onResponse = undefined,
	) => {
		const {
			userName,
			selfName,
			memoryAboutSelf,
			memoryAboutUser,
			shortTermMemory,
			getMemoryByDescription,
			chatWithMemory,
			setShortTermMemory,
		} = getState()
		const weather = plugins?.qWeatherApiKey
			? await getWeather(plugins.qWeatherApiKey)
			: ''
		const worldInfo = `- 当前的时间: ${getTime(Date.now())}\n- 本轮对话开始的时间: ${getTime(shortTermMemory[0].timestamp)}\n- 你首次和用户相遇的时间: ${getTime(firstEncounterTime)}${weather ? `\n- 当前天气信息: ${weather}` : ''}`
		const prompt =
			`# 任务要求\n\n${CHAT_PROMPT}` +
			`\n\n# 你的个人信息\n\n我叫${selfName}. ${memoryAboutSelf || ''}` +
			`\n\n# 用户的个人信息\n\n用户叫${userName}. ${memoryAboutUser || ''}` +
			`\n\n# 真实世界的相关信息\n\n${worldInfo}`
		const response = await chatApi.chat.completions.create({
			model,
			stream: true,
			stream_options: {
				include_usage: true,
			},
			tools: TOOLS,
			tool_choice: canSearchMemory ? 'auto' : 'none',
			messages: [
				{ role: 'system', content: prompt },
				...input.map((item) => {
					if (item.role === 'tool') {
						return {
							role: item.role,
							content: item.content,
							tool_call_id: item.tool_call_id,
						} as { role: 'tool'; content: string; tool_call_id: string }
					}
					if (item.role === 'assistant' && item.tool_calls) {
						return {
							role: item.role,
							content: item.content,
							tool_calls: item.tool_calls,
						} as { role: 'assistant'; content: string; tool_calls: unknown[] }
					}
					return { role: item.role, content: item.content } as {
						role: 'user' | 'assistant'
						content: string
					}
				}),
			],
		})
		let tokens = 0
		let responseText = ''
		let thinkProcess = ''
		let toolCallId = ''
		let toolCallName = ''
		let toolCallArgs = ''
		for await (const chunk of response) {
			if (chunk.usage) {
				tokens = chunk.usage.total_tokens
			}
			if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
				const data = chunk.choices[0].delta
				// @ts-expect-error 部分 API 服务自定义字段
				if (typeof data.reasoning_content === 'string') {
					// @ts-expect-error 部分 API 服务自定义字段
					thinkProcess += data.reasoning_content
				}
				if (data.content) {
					responseText += data.content
					if (typeof onResponse === 'function') {
						await onResponse(responseText)
					}
				}
				if (Array.isArray(data.tool_calls) && data.tool_calls.length > 0) {
					const toolCall = data.tool_calls[0]
					if (toolCall.id) {
						toolCallId = toolCall.id
					}
					if (toolCall.function?.name) {
						toolCallName = toolCall.function.name
					}
					if (toolCall.function?.arguments) {
						toolCallArgs += toolCall.function.arguments
					}
				}
			}
		}
		const toolCall: OpenAI.ChatCompletionMessageToolCall | null =
			toolCallId && toolCallName && toolCallArgs
				? {
						id: toolCallId,
						type: 'function',
						function: {
							name: toolCallName,
							arguments: toolCallArgs,
						},
					}
				: null

		if (toolCall) {
			const existing = input
				.filter((item) => item.role === 'tool')
				.flatMap((item) => item.recall || [])
				.flatMap((item) => item.uuid)
			const description = JSON.parse(
				toolCall.function.arguments,
			).memoryDescription
			if (typeof description !== 'string') {
				throw new Error('模型返回错误的函数调用, 请重试')
			}
			const memories = (
				await getMemoryByDescription(vector, description)
			).filter((item) => !existing.includes(item.uuid))
			let message: ShortTermMemory
			if (memories.length > 0) {
				message = {
					role: 'tool',
					content: memories
						.map(
							(item) =>
								`- ${item.summary} (生成于 ${getTime(item.startTime)} - ${getTime(item.endTime)} 的对话)`,
						)
						.join('\n'),
					timestamp: Date.now(),
					recall: memories.map((item) => ({
						uuid: item.uuid,
						similarity: item.similarity,
						desc: description,
					})),
					tool_call_id: toolCall.id,
					uuid: uuid(),
				}
			} else {
				message = {
					role: 'tool',
					content: '没有在记忆库中找到更多相关的记忆',
					timestamp: Date.now(),
					recall: [],
					tool_call_id: toolCall.id,
					uuid: uuid(),
				}
			}
			const newInput = [
				...input,
				{
					role: 'assistant',
					content: '',
					timestamp: Date.now(),
					tool_calls: [toolCall],
					uuid: uuid(),
				},
				message,
			]
			await setShortTermMemory(newInput)
			return chatWithMemory(chatApi, model, newInput, vector, plugins, false)
		}
		const { content: result, think } = parseThink(responseText)
		return {
			result,
			think: thinkProcess || think,
			tokens,
			output: input,
		}
	},
	updateMemory: async (chatApi, model, vector) => {
		const {
			shortTermMemory,
			longTermMemory,
			setShortTermMemory,
			setLongTermMemory,
			setMemoryAboutSelf,
			setMemoryAboutUser,
			memoryAboutSelf,
			memoryAboutUser,
			archivedMemory,
			setArchivedMemory,
		} = getState()
		if (shortTermMemory.length === 0) {
			throw new Error('请先进行对话, 再更新记忆')
		}
		const prev = clone(shortTermMemory)
		const result = await updateMemory({
			ai: chatApi,
			model: model,
			oldSelfInfo: memoryAboutSelf,
			oldUserInfo: memoryAboutUser,
			messages: prev,
		})
		const newLongTermMemory: LongTermMemory[] = await Promise.all(
			result.newMemories.map(async (item) => {
				const vec = await vector(item.summary).catch(() => undefined)
				return {
					...item,
					vector: vec,
				}
			}),
		)
		await setMemoryAboutSelf(result.newAiInfo)
		await setMemoryAboutUser(result.newHumanInfo)
		await setShortTermMemory([])
		await setLongTermMemory([...newLongTermMemory, ...longTermMemory])
		await setArchivedMemory([...prev, ...archivedMemory])
		return
	},
	shouldUpdateMemory: () => {
		const { shortTermMemory } = getState()
		if (shortTermMemory.length === 0) {
			return false
		}
		const timestamp = Math.max(...shortTermMemory.map((item) => item.timestamp))
		const hours = (Date.now() - timestamp) / 1000 / 60 / 60
		return hours >= UPDATE_MEMORY_AFTER_HOURS
	},
	saveAllMemory: () => {
		const {
			memoryAboutSelf,
			memoryAboutUser,
			longTermMemory,
			shortTermMemory,
			archivedMemory,
			selfName,
			userName,
		} = getState()
		const data = JSON.stringify(
			{
				selfName,
				userName,
				memoryAboutSelf,
				memoryAboutUser,
				longTermMemory,
				shortTermMemory,
				archivedMemory,
			},
			null,
			2,
		)
		return save(data)
	},
	resetAllMemory: async () => {
		const {
			setMemoryAboutSelf,
			setMemoryAboutUser,
			setLongTermMemory,
			setShortTermMemory,
			setArchivedMemory,
			setSelfName,
			setUserName,
		} = getState()
		await setSelfName(DEFAULT_SELF_NAME)
		await setUserName(DEFAULT_USER_NAME)
		await setMemoryAboutSelf(DEFAULT_MEMORY_ABOUT_SELF)
		await setMemoryAboutUser(DEFAULT_MEMORY_ABOUT_USER)
		await setLongTermMemory([])
		await setShortTermMemory([])
		await setArchivedMemory([])
		return
	},
	importAllMemory: async (memory) => {
		const {
			setSelfName,
			setUserName,
			setMemoryAboutSelf,
			setMemoryAboutUser,
			setLongTermMemory,
			setShortTermMemory,
			setArchivedMemory,
		} = getState()
		if (!memory) {
			throw new Error('没有记忆数据')
		}
		const data = JSON.parse(memory)
		if (
			typeof data !== 'object' ||
			typeof data.selfName !== 'string' ||
			typeof data.userName !== 'string' ||
			typeof data.memoryAboutSelf !== 'string' ||
			typeof data.memoryAboutUser !== 'string' ||
			!Array.isArray(data.longTermMemory) ||
			!Array.isArray(data.shortTermMemory) ||
			!Array.isArray(data.archivedMemory) ||
			data.longTermMemory.some(
				(item: LongTermMemory) =>
					typeof item.uuid !== 'string' ||
					typeof item.summary !== 'string' ||
					typeof item.startTime !== 'number' ||
					typeof item.endTime !== 'number',
			) ||
			data.shortTermMemory.some(
				(item: ShortTermMemory) =>
					typeof item.role !== 'string' ||
					typeof item.content !== 'string' ||
					typeof item.uuid !== 'string' ||
					typeof item.timestamp !== 'number',
			) ||
			data.archivedMemory.some(
				(item: ArchivedMemory) =>
					typeof item.role !== 'string' ||
					typeof item.content !== 'string' ||
					typeof item.uuid !== 'string' ||
					typeof item.timestamp !== 'number',
			)
		) {
			throw new Error('数据格式错误')
		}
		await setSelfName(data.selfName || DEFAULT_SELF_NAME)
		await setUserName(data.userName || DEFAULT_USER_NAME)
		await setMemoryAboutSelf(data.memoryAboutSelf || DEFAULT_MEMORY_ABOUT_SELF)
		await setMemoryAboutUser(data.memoryAboutUser || DEFAULT_MEMORY_ABOUT_USER)
		await setLongTermMemory(data.longTermMemory)
		await setShortTermMemory(data.shortTermMemory)
		await setArchivedMemory(data.archivedMemory)
		return
	},
	exportAllMemory: async (pretty = false) => {
		const {
			selfName,
			userName,
			memoryAboutSelf,
			memoryAboutUser,
			longTermMemory,
			shortTermMemory,
			archivedMemory,
		} = getState()
		const data = pretty
			? JSON.stringify(
					{
						selfName,
						userName,
						memoryAboutSelf,
						memoryAboutUser,
						longTermMemory,
						shortTermMemory,
						archivedMemory,
					},
					null,
					2,
				)
			: JSON.stringify({
					selfName,
					userName,
					memoryAboutSelf,
					memoryAboutUser,
					longTermMemory,
					shortTermMemory,
					archivedMemory,
				})
		return data
	},
	selfName: localSelfName || DEFAULT_SELF_NAME,
	userName: localUserName || DEFAULT_USER_NAME,
	memoryAboutSelf: localMemoryAboutSelf || DEFAULT_MEMORY_ABOUT_SELF,
	memoryAboutUser: localMemoryAboutUser || DEFAULT_MEMORY_ABOUT_USER,
	longTermMemory: localLongTermMemory || [],
	shortTermMemory: localShortTermMemory || [],
	archivedMemory: localArchivedMemory || [],
	deleteLongTermMemory: async (uuid) => {
		const { longTermMemory } = getState()
		const newLongTermMemory = longTermMemory.filter(
			(item) => item.uuid !== uuid,
		)
		setState({
			longTermMemory: newLongTermMemory,
		})
		await set('long_term_memory', newLongTermMemory)
		return
	},
	setSelfName: async (name) => {
		const v = name || DEFAULT_SELF_NAME
		setState({ selfName: v })
		await set('self_name', v)
		return
	},
	setUserName: async (name) => {
		const v = name || DEFAULT_USER_NAME
		setState({ userName: v })
		await set('user_name', v)
		return
	},
	setMemoryAboutSelf: async (content) => {
		setState({ memoryAboutSelf: content })
		await set('memory_about_self', content)
		return
	},
	setMemoryAboutUser: async (content) => {
		setState({ memoryAboutUser: content })
		await set('memory_about_user', content)
		return
	},
	setLongTermMemory: async (memory) => {
		setState({ longTermMemory: memory })
		await set('long_term_memory', memory)
		return
	},
	setShortTermMemory: async (memory) => {
		setState({ shortTermMemory: memory })
		await set('short_term_memory', memory)
		return
	},
	setArchivedMemory: async (memory) => {
		setState({ archivedMemory: memory })
		await set('archived_memory', memory)
		return
	},
}))

type UpdateMemoryParams = {
	ai: OpenAI
	model: string
	messages: ShortTermMemory[]
	oldUserInfo: string
	oldSelfInfo: string
}

type UpdateMemoryResult = {
	newHumanInfo: string
	newAiInfo: string
	newMemories: LongTermMemory[]
}

async function updateMemory({
	ai,
	model,
	messages,
	oldUserInfo,
	oldSelfInfo,
}: UpdateMemoryParams): Promise<UpdateMemoryResult> {
	const timestamps = messages.map((item) => item.timestamp)
	const startTime = Math.min(...timestamps)
	const endTime = Math.max(...timestamps)
	const oldUserInfoText =
		oldUserInfo || '(这是这个人类和虚拟人类的第一次对话, 没有旧的个人信息)'
	const oldSelfInfoText =
		oldSelfInfo || '(这是这个人类和虚拟人类的第一次对话, 没有旧的个人信息)'
	const messagesText = messages
		.map((item, index) => {
			if (item.role === 'user') {
				return `${index + 1}. 人类: ${item.content}`
			}
			if (item.role === 'tool') {
				return `${index + 1}. 记忆提取结果: ${item.content}`
			}
			if (item.role === 'assistant' && item.tool_calls?.length) {
				return `${index + 1}. 虚拟人类 (提取记忆): ${JSON.stringify(
					item.tool_calls[0].function,
				).replace(/\n/g, '')}`
			}
			return `${index + 1}. 虚拟人类: ${item.content}`
		})
		.join('\n')
	const prompt = `# 任务要求\n\n${UPDATE_MEMORY_PROMPT}\n\n# 旧的人类个人信息\n\n${oldUserInfoText}\n\n# 旧的虚拟人类个人信息\n\n${oldSelfInfoText}\n\n# 本次对话内容\n\n${messagesText}`
	const response = await ai.chat.completions.create({
		model,
		messages: [{ role: 'user', content: prompt }],
		stream: true,
	})
	let result = ''
	for await (const chunk of response) {
		if (Array.isArray(chunk.choices) && chunk.choices.length > 0) {
			const data = chunk.choices[0].delta
			if (data.content) {
				result += data.content
			}
		}
	}
	result = parseThink(result).content.trim()
	if (result.startsWith('```json')) {
		result = result.slice(7).trim()
	}
	if (result.endsWith('```')) {
		result = result.slice(0, -3).trim()
	}
	if (!result.startsWith('{')) {
		const firstBrace = result.indexOf('{')
		if (firstBrace !== -1) {
			result = result.slice(firstBrace).trim()
		}
	}
	if (!result.endsWith('}')) {
		const lastBrace = result.lastIndexOf('}')
		if (lastBrace !== -1) {
			result = result.slice(0, lastBrace + 1).trim()
		}
	}
	const parsedResult = JSON.parse(result) as Omit<
		UpdateMemoryResult,
		'newMemories'
	> & {
		newMemories: string[]
	}
	if (
		typeof parsedResult !== 'object' ||
		typeof parsedResult.newHumanInfo !== 'string' ||
		typeof parsedResult.newAiInfo !== 'string' ||
		!Array.isArray(parsedResult.newMemories) ||
		parsedResult.newMemories.some((item) => typeof item !== 'string')
	) {
		throw new Error('模型返回数据格式错误, 请重试')
	}
	const newMemories: LongTermMemory[] = parsedResult.newMemories.map(
		(item) => ({
			uuid: uuid(),
			summary: item,
			startTime,
			endTime,
		}),
	)
	return {
		newHumanInfo: parsedResult.newHumanInfo,
		newAiInfo: parsedResult.newAiInfo,
		newMemories,
	}
}

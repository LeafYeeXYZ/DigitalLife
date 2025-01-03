import { create } from 'zustand'
import { get, set, save, getTime, uuid, clone, getWeather } from '../utils.ts'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

type Memory = {
  // 相关记忆信息
  selfName: string
  userName: string
  memoryAboutSelf: string
  memoryAboutUser: string
  longTermMemory: LongTermMemory[]
  shortTermMemory: ShortTermMemory[]
  archivedMemory: ArchivedMemory[]
  // 设置相关记忆信息
  setSelfName: (name: string) => Promise<void>
  setUserName: (name: string) => Promise<void>
  setMemoryAboutSelf: (content: string) => Promise<void>
  setMemoryAboutUser: (content: string) => Promise<void>
  setLongTermMemory: (memory: LongTermMemory[]) => Promise<void>
  setShortTermMemory: (memory: ShortTermMemory[]) => Promise<void>
  setArchivedMemory: (memory: ArchivedMemory[]) => Promise<void>
  // 记忆更新 (短时记忆 -> 长时记忆, 并递归更新自我概念)
  shouldUpdateMemory: () => boolean
  updateMemory: (chatApi: ChatApi, model: string) => Promise<void>
  // 重置和保存
  resetAllMemory: () => Promise<void>
  saveAllMemory: () => Promise<string>
  // 当前上下文总结 (递归更新)
  currentSummary: string
  setCurrentSummary: (content: string) => Promise<void>
  // 聊天
  chatWithMemory: (chatApi: ChatApi, model: string, input: ShortTermMemory[], options?: ChatOptions) => AsyncGenerator<{ response: string, done: false } | { response: string, done: true, token: number }, void, unknown>
  updateCurrentSummary: (chatApi: ChatApi, model: string) => Promise<void>
}

type ChatOptions = {
  qWeatherApiKey?: string
}

const UPDATE_MEMORY_AFTER_HOURS = 6
const DEFAULT_SELF_NAME = '小叶子'
const DEFAULT_USER_NAME = '旅行者'
const DEFAULT_MEMORY_ABOUT_SELF = '我是一个在大学学习心理学的男孩子'
const DEFAULT_MEMORY_ABOUT_USER = ''
const FORMAT_PROMPT = '以支持、温柔、可爱的方式陪伴对方. 不要回复长的和正式的内容, 避免说教和指导, 避免总是以提问结尾. 表现得像一个真实和共情的朋友. 回复务必要简短, 且不要使用任何 Markdown 格式. 多使用 Emoji 来表达情绪和让对话更生动. 多呼唤对方的名字, 以增加亲密感.'

const localSelfName = await get('self_name')
const localUserName = await get('user_name')
const localMemoryAboutSelf = await get('memory_about_self')
const localMemoryAboutUser = await get('memory_about_user')
const localLongTermMemory = await get('long_term_memory')
const localShortTermMemory = await get('short_term_memory')
const localArchivedMemory = await get('archived_memory')
const localCurrentSummary = await get('current_summary')

const UpdateMemoryResponse = z.object({
  updatedMemoryAboutSelf: z.string(),
  updatedMemoryAboutUser: z.string(),
  summaryOfMessages: z.string(),
  titleOfMessages: z.string(),
})
const UpdateCurrentSummaryResponse = z.object({
  updatedSummary: z.string(),
})

export const useMemory = create<Memory>()((setState, getState) => ({
  chatWithMemory: async function* (chatApi, model, input, options) {
    const { currentSummary, memoryAboutSelf, memoryAboutUser, selfName, userName } = getState()
    const weather = options?.qWeatherApiKey ? await getWeather(options.qWeatherApiKey) : ''
    const messages: { role: 'system' | 'user' | 'assistant', content: string }[] = []
    messages.push({ role: 'system', content: `你是一个虚拟人类, 下面是你的记忆、对你的要求、对已有对话的总结、外部世界信息:\n\n# 你对自己的记忆\n\n我叫${selfName}. ${memoryAboutSelf || '(无其他记忆)'}\n\n# 你对用户的记忆\n\n用户叫${userName}. ${memoryAboutUser || '(无其他记忆)'}\n\n# 对你的要求\n\n${FORMAT_PROMPT}\n\n# 对已有对话的总结\n\n${currentSummary}\n\n# 外部世界信息\n\n- 当前时间: ${getTime(Date.now())}\n- 对话开始时间: ${getTime(input[0].timestamp)}${weather ? `\n- 当前天气信息: ${weather}` : ''}` })
    messages.push(...input.map(({ role, content }) => ({ role, content })) as { role: 'user' | 'assistant', content: string }[])
    const response = await chatApi.chat.completions.create({
      model,
      stream: true,
      stream_options: { include_usage: true },
      messages,
    })
    for await (const chunk of response) {
      if (chunk.usage) {
        yield { response: chunk.choices[0]?.delta.content ?? '', done: true, token: chunk.usage.total_tokens }
      } else {
        yield { response: chunk.choices[0]?.delta.content ?? '', done: false }
      }
    }
  },
  updateCurrentSummary: async (chatApi, model) => {
    const { shortTermMemory, setCurrentSummary, currentSummary } = getState()
    if (shortTermMemory.length < 2) {
      throw new Error('没有需要总结的对话内容')
    }
    const oldMessages = shortTermMemory.slice(0, shortTermMemory.length - 2)
    const newMessages = shortTermMemory.slice(shortTermMemory.length - 2)
    console.warn('Ollama 暂不兼容 OpenAI JS SDK 的 beta 结构化输入, 为了兼容性考虑, 使用 fetch 方式发送请求')
    console.warn('typeof chatApi', typeof chatApi)
    // const response = await chatApi.beta.chat.completions.parse({
    //   model: env.VITE_OPENAI_MODEL_NAME,
    //   stream: false,
    //   response_format: zodResponseFormat(UpdateCurrentSummaryResponse, 'update_current_summary_response'),
    //   messages: [
    //     { role: 'system', content: `**请按格式返回JSON字符串**\n\n你是一个虚拟人类. 在你与用户的对话过程中, 你必须不断根据最新的对话内容, 生成/更新你对对话内容的总结. 你的总结中应当包含这轮对话的主要内容、用户提到的重要信息和事实、你的回答和建议, 以及你对这轮对话的感受和反思等等内容. 如果你觉得没有需要更新的内容, 也可以直接返回原有的总结内容. 在总结中, 请用"我"代表你自己, 用"用户"代表用户\n\n# 原有总结\n\n${currentSummary || '(这是第一轮对话, 没有原有总结)'}\n\n# 已总结的对话内容\n\n${oldMessages.map(({ role, content }, index) => `${index + 1}. ${role === 'user' ? '用户' : '我'}: ${content}`).join('\n') || '(这是第一轮对话, 没有已总结的对话内容)'}\n\n# 新增的对话内容\n\n${newMessages.map(({ role, content }, index) => `${index + 1}. ${role === 'user' ? '用户' : '我'}: ${content}`).join('\n')}` },
    //   ],
    // })
    const response = await (await fetch(`${chatApi.baseURL}chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${chatApi.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        response_format: zodResponseFormat(UpdateCurrentSummaryResponse, 'update_current_summary_response'),
        messages: [
          { role: 'system', content: `**请按格式返回JSON字符串**\n\n你是一个虚拟人类. 在你与用户的对话过程中, 你必须不断根据最新的对话内容, 生成/更新你对对话内容的总结. 你的总结中应当包含这轮对话的主要内容、用户提到的重要信息和事实、你的回答和建议, 以及你对这轮对话的感受和反思等等内容. 如果你觉得没有需要更新的内容, 也可以直接返回原有的总结内容. 在总结中, 请用"我"代表你自己, 用"用户"代表用户\n\n# 原有总结\n\n${currentSummary || '(这是第一轮对话, 没有原有总结)'}\n\n# 已总结的对话内容\n\n${oldMessages.map(({ role, content }, index) => `${index + 1}. ${role === 'user' ? '用户' : '我'}: ${content}`).join('\n') || '(这是第一轮对话, 没有已总结的对话内容)'}\n\n# 新增的对话内容\n\n${newMessages.map(({ role, content }, index) => `${index + 1}. ${role === 'user' ? '用户' : '我'}: ${content}`).join('\n')}` },
        ],
      }),
    })).json()
    // const result = response.choices[0].message?.parsed
    const result = UpdateCurrentSummaryResponse.parse(JSON.parse(response.choices[0].message.content))
    if (
      !result ||
      typeof result.updatedSummary !== 'string'
    ) {
      throw new Error('模型返回错误, 请重试')
    }
    await setCurrentSummary(result.updatedSummary)
    return
  },
  updateMemory: async (chatApi, model) => {
    const { shortTermMemory, longTermMemory, setShortTermMemory, setLongTermMemory, setMemoryAboutSelf, setMemoryAboutUser, setCurrentSummary, memoryAboutSelf, memoryAboutUser, archivedMemory, setArchivedMemory } = getState()
    console.warn('Ollama 暂不兼容 OpenAI JS SDK 的 beta 结构化输入, 为了兼容性考虑, 使用 fetch 方式发送请求')
    console.warn('typeof chatApi', typeof chatApi)
    // const response = await chatApi.beta.chat.completions.parse({
    //   model: env.VITE_OPENAI_MODEL_NAME,
    //   stream: false,
    //   response_format: zodResponseFormat(UpdateMemoryResponse, 'update_memory_response'),
    //   messages: [
    //     { role: 'system', content: `**请按格式返回JSON字符串**\n\n你是一个虚拟人类, 你刚刚与用户完成了一轮对话, 请总结这轮对话, 并为这轮对话取一个标题. 你的总结应当包含这轮对话的主要内容、用户提到的重要信息和事实、你的回答和建议, 以及你对这轮对话的感受和反思等等内容. 同时, 如果这轮对话让你对自己或用户有了新的认识, 请更新你对自己和用户的记忆 (如果没有, 则照原样返回旧的记忆). 请不要把你和用户的名字包含在你的记忆中, 用"我"代表自己, 用"用户"代表用户即可\n\n# 本轮对话前你对自己的记忆\n\n${memoryAboutSelf || '(无其他记忆)'}\n\n# 本轮对话前你对用户的记忆\n\n${memoryAboutUser || '(无其他记忆)'}\n\n# 本轮对话内容\n\n${shortTermMemory.map(({ role, content, timestamp }, index) => `${index + 1}. ${getTime(timestamp)}-${role === 'user' ? '用户' : '我'}: ${content}`).join('\n')}` },
    //   ],
    // })
    const response = await (await fetch(`${chatApi.baseURL}chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${chatApi.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        response_format: zodResponseFormat(UpdateMemoryResponse, 'update_memory_response'),
        messages: [
          { role: 'system', content: `**请按格式返回JSON字符串**\n\n你是一个虚拟人类, 你刚刚与用户完成了一轮对话, 请总结这轮对话, 并为这轮对话取一个标题. 你的总结应当包含这轮对话的主要内容、用户提到的重要信息和事实、你的回答和建议, 以及你对这轮对话的感受和反思等等内容. 同时, 如果这轮对话让你对自己或用户有了新的认识, 请更新你对自己和用户的记忆 (如果没有, 则照原样返回旧的记忆). 请不要把你和用户的名字包含在你的记忆中, 用"我"代表自己, 用"用户"代表用户即可\n\n# 本轮对话前你对自己的记忆\n\n${memoryAboutSelf || '(无其他记忆)'}\n\n# 本轮对话前你对用户的记忆\n\n${memoryAboutUser || '(无其他记忆)'}\n\n# 本轮对话内容\n\n${shortTermMemory.map(({ role, content, timestamp }, index) => `${index + 1}. ${getTime(timestamp)}-${role === 'user' ? '用户' : '我'}: ${content}`).join('\n')}` },
        ],
      }),
    })).json()
    // const result = response.choices[0].message?.parsed
    const result = UpdateMemoryResponse.parse(JSON.parse(response.choices[0].message.content))
    if (
      !result || 
      typeof result.updatedMemoryAboutSelf !== 'string' || 
      typeof result.updatedMemoryAboutUser !== 'string' ||
      typeof result.summaryOfMessages !== 'string' ||
      typeof result.titleOfMessages !== 'string'
    ) {
      throw new Error('模型返回错误, 请重试')
    }
    const prev = clone(shortTermMemory)
    const _uuid = uuid()
    const timestamps = prev.map((item) => item.timestamp)
    result.updatedMemoryAboutSelf && await setMemoryAboutSelf(result.updatedMemoryAboutSelf)
    result.updatedMemoryAboutUser && await setMemoryAboutUser(result.updatedMemoryAboutUser)
    await setCurrentSummary('')
    await setShortTermMemory([])
    await setLongTermMemory([
      {
        uuid: _uuid,
        title: result.titleOfMessages || '无标题',
        summary: result.summaryOfMessages || '无总结',
        startTime: Math.min(...timestamps),
        endTime: Math.max(...timestamps),
      },
      ...clone(longTermMemory),
    ])
    await setArchivedMemory([
      ...prev.map(({ role, content, timestamp }) => ({ role, content, timestamp, belongTo: _uuid })),
      ...clone(archivedMemory),
    ])
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
  currentSummary: localCurrentSummary || '',
  setCurrentSummary: async (content) => {
    setState({ currentSummary: content })
    await set('current_summary', content)
    return
  },
  saveAllMemory: () => {
    const { memoryAboutSelf, memoryAboutUser, longTermMemory, shortTermMemory, archivedMemory, selfName, userName, currentSummary } = getState()
    const data = JSON.stringify({
      selfName,
      userName,
      memoryAboutSelf,
      memoryAboutUser,
      longTermMemory,
      shortTermMemory,
      archivedMemory,
      currentSummary,
    }, null, 2)
    return save(data)
  },
  resetAllMemory: async () => {
    const { setMemoryAboutSelf, setMemoryAboutUser, setLongTermMemory, setShortTermMemory, setArchivedMemory, setCurrentSummary } = getState()
    await setMemoryAboutSelf(DEFAULT_MEMORY_ABOUT_SELF)
    await setMemoryAboutUser(DEFAULT_MEMORY_ABOUT_USER)
    await setCurrentSummary('')
    await setLongTermMemory([])
    await setShortTermMemory([])
    await setArchivedMemory([])
    return
  },
  selfName: localSelfName || DEFAULT_SELF_NAME,
  userName: localUserName || DEFAULT_USER_NAME,
  memoryAboutSelf: localMemoryAboutSelf || DEFAULT_MEMORY_ABOUT_SELF,
  memoryAboutUser: localMemoryAboutUser || DEFAULT_MEMORY_ABOUT_USER,
  longTermMemory: localLongTermMemory || [],
  shortTermMemory: localShortTermMemory || [],
  archivedMemory: localArchivedMemory || [],
  setSelfName: async (name) => {
    name = name || DEFAULT_SELF_NAME
    setState({ selfName: name })
    await set('self_name', name)
    return
  },
  setUserName: async (name) => {
    name = name || DEFAULT_USER_NAME
    setState({ userName: name })
    await set('user_name', name)
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

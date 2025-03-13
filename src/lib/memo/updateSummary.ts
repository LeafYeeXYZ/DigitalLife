import parseThink from '@leaf/parse-think'
import { getTime } from '../utils.ts'

type UpdateSummaryParams = {
	chatApi: ChatApi
	modelName: string
	newMessages: ShortTermMemory[]
	currentSummary?: string
}

type UpdateSummaryReturn = {
	updatedSummary: string
	tokensUsed: number
}

const UPDATE_SUMMARY_PROMPT =
	'你是一个数字生命 (即虚拟人类), 在你与用户的一轮对话中, 你需要不断根据最新的内容来生成/更新对本轮对话的总结. 你将收到已有的总结和新增的对话内容. 你的目标是参考新的对话内容, 在原有总结中纳入新的内容, 同时确保总结长度不超过 20 个句子, 最后输出新的总结. 为了更好地更新总结, 请按照以下步骤操作: \n\n1. 仔细分析已有的总结, 从中提取出已有的信息和事实. \n2. 考虑新增的对话内容, 找出需要纳入总结的任何新的或已改变的信息. \n3. 结合新旧信息, 创建最新的总结. \n4. 以简洁明了的方式组织更新后的总结, 确保不超过 20 句话. \n5. 注意信息的相关性和重要性, 重点抓住最重要的方面, 同时保持总结的整体连贯性. \n\n此外, 请不要把你和用户的名字包含在总结中, 用"我"代表自己, 用"用户"代表用户即可; 你的输出应只包含总结, 请不要额外输出任何其他内容; 总结的内容除了与用户相关的信息外, 也可以包含你的心情、感受、想法、反思或回应等.'

/**
 * 更新对话内总结
 * @param params
 * @param params.chatApi OpenAI API
 * @param params.modelName 模型名称
 * @param params.newMessages 新增的对话内容
 * @param params.currentSummary 当前对话内总结
 * @param params.extraPrompt 可选额外提示词, 将加入到末尾
 * @returns 更新后的总结和消耗的 token 数
 */
export async function updateSummary({
	chatApi,
	modelName,
	newMessages,
	currentSummary,
}: UpdateSummaryParams): Promise<UpdateSummaryReturn> {
	const messages = newMessages
		.map((item) => {
			if (item.role === 'tool') {
				return `- 系统-${getTime(item.timestamp)}: (记忆调用结果) ${item.content}`
			}
			if (item.role === 'assistant' && item.tool_calls) {
				const description = JSON.parse(
					item.tool_calls[0].function.arguments,
				).memoryDescription
				return `- 你-${getTime(item.timestamp)}: (进行记忆调用) 调用和"${description}"相关的记忆`
			}
			if (item.role === 'assistant') {
				return `- 你-${getTime(item.timestamp)}: ${item.content}`
			}
			return `- 用户-${getTime(item.timestamp)}: ${item.content}`
		})
		.join('\n')
	const prompt =
		UPDATE_SUMMARY_PROMPT +
		`\n\n# 已有总结\n\n${currentSummary || '(这是第一轮对话, 没有已有总结)'}` +
		`\n\n# 新增对话内容\n\n${messages}`
	const response = await chatApi.chat.completions.create({
		model: modelName,
		stream: false,
		messages: [{ role: 'user', content: prompt }],
	})
	const tokens = response.usage?.total_tokens || -1
	const result = response.choices[0].message.content
	if (typeof result !== 'string') {
		throw new Error('模型在更新总结时返回错误, 请重试')
	}
	const { content } = parseThink(result)
	return { updatedSummary: content, tokensUsed: tokens }
}

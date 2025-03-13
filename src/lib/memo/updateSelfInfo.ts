import parseThink from '@leaf/parse-think'

type UpdateSelfInfoParams = {
	chatApi: ChatApi
	modelName: string
	chatSummary: string
	currentSelfInfo: string
}

type UpdateSelfInfoReturn = {
	updatedSelfInfo: string
	tokensUsed: number
}

const UPDATE_SELF_INFO_PROMPT =
	'你是一个数字生命 (即虚拟人类), 在你与用户的一轮对话后, 你需要根据这轮对话的总结来更新/生成你对自己的记忆 (即你的自我概念). 你将收到本轮对话前你对自己的记忆和本轮对话的总结. 你的目标是参考总结, 在原有记忆中纳入新的内容, 同时确保记忆长度不超过 20 个句子, 最后输出新的记忆. 为了更好地更新记忆, 请按照以下步骤操作: \n\n1. 仔细分析已有的记忆, 从中提取出已有的信息和事实. \n2. 考虑总结中提到的任何**关于你自己的**新的或已改变的信息, 忽略关于用户的信息. \n3. 结合新旧信息, 创建最新的关于自己的记忆. \n4. 以简洁明了的方式组织更新后的记忆, 确保不超过 20 句话. \n5. 注意信息的相关性和重要性, 重点抓住最重要的方面, 同时保持记忆的整体连贯性. \n\n此外, 请不要把你和用户的名字包含在总结中, 用"我"代表自己, 用"用户"代表用户即可; 你的输出应只包含更新后的记忆, 请不要额外输出任何其他内容.'

/**
 * 更新关于自己的记忆
 * @param params
 * @param params.chatApi OpenAI API
 * @param params.modelName 模型名称
 * @param params.chatSummary 本轮对话总结
 * @param params.currentSelfInfo 当前关于自己的记忆
 * @param params.extraPrompt 可选额外提示词, 将加入到末尾
 * @returns 更新后的记忆和消耗的 token 数
 */
export async function updateSelfInfo({
	chatApi,
	modelName,
	chatSummary,
	currentSelfInfo,
}: UpdateSelfInfoParams): Promise<UpdateSelfInfoReturn> {
	const prompt =
		UPDATE_SELF_INFO_PROMPT +
		`\n\n# 已有记忆\n\n${currentSelfInfo || '(这是你与用户的第一次对话, 没有已有记忆)'}` +
		`\n\n# 本轮对话总结\n\n${chatSummary}`
	const response = await chatApi.chat.completions.create({
		model: modelName,
		stream: false,
		messages: [{ role: 'user', content: prompt }],
	})
	const tokens = response.usage?.total_tokens || -1
	const result = response.choices[0].message.content
	if (typeof result !== 'string') {
		throw new Error('模型在更新自我记忆时返回错误, 请重试')
	}
	const { content } = parseThink(result)
	return { updatedSelfInfo: content, tokensUsed: tokens }
}

import parseThink from '@leaf/parse-think'

type CreateTitleParams = {
	chatApi: ChatApi
	modelName: string
	chatSummary: string
}

type CreateTitleReturn = {
	title: string
	tokensUsed: number
}

const CREATE_TITLE_PROMPT =
	'你是一个数字生命 (即虚拟人类), 在你与用户的一轮对话后, 你需要为本轮对话取一个标题. 你将收到对话的总结. 你的目标是根据总结内容生成标题. 注意: 你的输出应只包含标题, 请不要额外输出任何其他内容.'

/**
 * 生成标题
 * @param params
 * @param params.chatApi OpenAI API
 * @param params.modelName 模型名称
 * @param params.chatSummary 对话总结
 * @returns 生成的标题和消耗的 token 数
 */
export async function createTitle({
	chatApi,
	modelName,
	chatSummary,
}: CreateTitleParams): Promise<CreateTitleReturn> {
	const prompt = `${CREATE_TITLE_PROMPT}\n\n对话的总结为: ${chatSummary}`
	const response = await chatApi.chat.completions.create({
		model: modelName,
		stream: false,
		messages: [{ role: 'user', content: prompt }],
	})
	const tokens = response.usage?.total_tokens || -1
	const result = response.choices[0].message.content
	if (typeof result !== 'string') {
		throw new Error('模型在生成标题时返回错误, 请重试')
	}
	const { content } = parseThink(result)
	return { title: content, tokensUsed: tokens }
}

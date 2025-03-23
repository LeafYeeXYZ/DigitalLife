import { DeleteOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Space, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { useVectorApi } from '../../lib/hooks/useVectorApi.ts'
import { clone } from '../../lib/utils.ts'

export function ConfigVector() {
	const jinaApiKey = useVectorApi((state) => state.jinaApiKey)
	const jinaEndpoint = useVectorApi((state) => state.jinaEndpoint)
	const vectorDimension = useVectorApi((state) => state.vectorDimension)
	const setJinaApiKey = useVectorApi((state) => state.setJinaApiKey)
	const setJinaEndpoint = useVectorApi((state) => state.setJinaEndpoint)
	const setVectorDimension = useVectorApi((state) => state.setVectorDimension)
	const vectorApi = useVectorApi((state) => state.vectorApi)
	const longTermMemory = useMemory((state) => state.longTermMemory)
	const setLongTermMemory = useMemory((state) => state.setLongTermMemory)
	const messageApi = useStates((state) => state.messageApi)
	const disabled = useStates((state) => state.disabled)
	const setDisabled = useStates((state) => state.setDisabled)
	const [form] = Form.useForm()
	const [jinaApiKeyModified, setJinaApiKeyModified] = useState(false)
	const [jinaEndpointModified, setJinaEndpointModified] = useState(false)
	const [vectorDimensionModified, setVectorDimensionModified] = useState(false)
	useEffect(() => form.setFieldsValue({ jinaApiKey }), [jinaApiKey, form])
	useEffect(() => form.setFieldsValue({ jinaEndpoint }), [jinaEndpoint, form])
	useEffect(
		() => form.setFieldsValue({ vectorDimension }),
		[vectorDimension, form],
	)

	return (
		<div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
			<Form form={form} layout='vertical'>
				<Form.Item
					label={
						<span>
							嵌入服务地址 <Tag>jina-embedding-v3 Endpoint</Tag>
						</span>
					}
				>
					<Space.Compact block>
						<Tooltip title='恢复默认值' color='blue'>
							<Button
								type='default'
								autoInsertSpace={false}
								icon={<ReloadOutlined />}
								onClick={async () => {
									await setJinaEndpoint()
									setJinaEndpointModified(false)
									messageApi?.success('嵌入服务地址已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='jinaEndpoint'>
							<Input
								className='w-full'
								onChange={() => setJinaEndpointModified(true)}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={jinaEndpointModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								onClick={async () => {
									const endpoint = form.getFieldValue('jinaEndpoint')
									if (!endpoint) return messageApi?.error('请输入嵌入服务地址')
									await setJinaEndpoint(
										endpoint.endsWith('/') ? endpoint : `${endpoint}/`,
									)
									setJinaEndpointModified(false)
									messageApi?.success('嵌入服务地址已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item
					label={
						<span>
							嵌入服务密钥 <Tag>jina-embedding-v3 API Key</Tag>
						</span>
					}
				>
					<Space.Compact block>
						<Tooltip title='删除密钥' color='blue'>
							<Button
								type='default'
								autoInsertSpace={false}
								icon={<DeleteOutlined />}
								onClick={async () => {
									await setJinaApiKey()
									setJinaApiKeyModified(false)
									messageApi?.success('嵌入服务密钥已删除')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='jinaApiKey'>
							<Input.Password
								className='w-full'
								onChange={() => setJinaApiKeyModified(true)}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={jinaApiKeyModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								onClick={async () => {
									const key = form.getFieldValue('jinaApiKey')
									if (!key) return messageApi?.error('请输入嵌入服务密钥')
									await setJinaApiKey(key)
									setJinaApiKeyModified(false)
									messageApi?.success('嵌入服务密钥已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item label='嵌入向量维度'>
					<Space.Compact block>
						<Tooltip title='恢复默认值' color='blue'>
							<Button
								type='default'
								autoInsertSpace={false}
								icon={<ReloadOutlined />}
								onClick={async () => {
									await setVectorDimension()
									setVectorDimensionModified(false)
									messageApi?.success('嵌入向量维度已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='vectorDimension'>
							<InputNumber
								style={{ width: '100%' }}
								onChange={() => setVectorDimensionModified(true)}
								min={100}
								max={1500}
								step={1}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={vectorDimensionModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								onClick={async () => {
									await setVectorDimension(
										Number(form.getFieldValue('vectorDimension')),
									)
									setVectorDimensionModified(false)
									messageApi?.success('嵌入向量维度已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item
					label={
						<span>
							索引记忆{' '}
							<Tag>
								{
									longTermMemory.filter(
										(item) =>
											item.vector && item.vector.length === vectorDimension,
									).length
								}{' '}
								/ {longTermMemory.length} 已索引
							</Tag>
						</span>
					}
				>
					<div className='flex justify-between items-center gap-4'>
						<Button
							block
							disabled={
								!jinaApiKey ||
								!jinaEndpoint ||
								!vectorDimension ||
								disabled !== false
							}
							loading={disabled === '索引记忆中'}
							onClick={async () => {
								try {
									setDisabled('索引记忆中')
									const memo = clone(longTermMemory)
									for (const item of memo) {
										if (
											!item.vector ||
											item.vector.length !== vectorDimension
										) {
											const vector = await vectorApi(item.summary)
											item.vector = vector
										}
									}
									setLongTermMemory(memo)
									messageApi?.success('已索引所有记忆')
								} catch (e) {
									messageApi?.error(
										`索引记忆失败: ${e instanceof Error ? e.message : e}`,
									)
								} finally {
									setDisabled(false)
								}
							}}
						>
							索引所有记忆
						</Button>
						<Button
							block
							disabled={
								!jinaApiKey ||
								!jinaEndpoint ||
								!vectorDimension ||
								disabled !== false
							}
							loading={disabled === '重建索引中'}
							onClick={async () => {
								try {
									setDisabled('重建索引中')
									const memo = clone(longTermMemory)
									for (const item of memo) {
										const vector = await vectorApi(item.summary)
										item.vector = vector
									}
									setLongTermMemory(memo)
									messageApi?.success('已重建所有索引')
								} catch (e) {
									messageApi?.error(
										`重建索引失败: ${e instanceof Error ? e.message : e}`,
									)
								} finally {
									setDisabled(false)
								}
							}}
						>
							重建所有索引
						</Button>
					</div>
				</Form.Item>
			</Form>
		</div>
	)
}

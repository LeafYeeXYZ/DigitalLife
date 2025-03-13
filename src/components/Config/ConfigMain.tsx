import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Space, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useChatApi } from '../../lib/hooks/useChatApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'

export function ConfigMain() {
	const {
		openaiEndpoint,
		openaiApiKey,
		openaiModelName,
		maxToken,
		setOpenaiEndpoint,
		setOpenaiApiKey,
		setOpenaiModelName,
		setMaxToken,
	} = useChatApi()
	const { messageApi } = useStates()
	const [form] = Form.useForm()
	const [openaiModelNameModified, setOpenaiModelNameModified] = useState(false)
	const [openaiApiKeyModified, setOpenaiApiKeyModified] = useState(false)
	const [openaiEndpointModified, setOpenaiEndpointModified] = useState(false)
	const [maxTokenModified, setMaxTokenModified] = useState(false)
	useEffect(
		() => form.setFieldsValue({ openaiModelName }),
		[openaiModelName, form],
	)
	useEffect(() => form.setFieldsValue({ openaiApiKey }), [openaiApiKey, form])
	useEffect(
		() => form.setFieldsValue({ openaiEndpoint }),
		[openaiEndpoint, form],
	)
	useEffect(() => form.setFieldsValue({ maxToken }), [maxToken, form])

	return (
		<div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
			<Form form={form} layout='vertical'>
				<Form.Item
					label={
						<span>
							推理服务地址 <Tag>OpenAI Endpoint</Tag>
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
									await setOpenaiEndpoint()
									setOpenaiEndpointModified(false)
									messageApi?.success('推理服务地址已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='openaiEndpoint'>
							<Input
								className='w-full'
								onChange={() => setOpenaiEndpointModified(true)}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={openaiEndpointModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								onClick={async () => {
									const endpoint = form.getFieldValue('openaiEndpoint')
									if (!endpoint) return messageApi?.error('请输入推理服务地址')
									await setOpenaiEndpoint(
										endpoint.endsWith('/') ? endpoint : `${endpoint}/`,
									)
									setOpenaiEndpointModified(false)
									messageApi?.success('推理服务地址已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item
					label={
						<span>
							推理服务密钥 <Tag>OpenAI API Key</Tag>
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
									await setOpenaiApiKey()
									setOpenaiApiKeyModified(false)
									messageApi?.success('推理服务密钥已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='openaiApiKey'>
							<Input.Password
								className='w-full'
								onChange={() => setOpenaiApiKeyModified(true)}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={openaiApiKeyModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								onClick={async () => {
									const key = form.getFieldValue('openaiApiKey')
									if (!key) return messageApi?.error('请输入推理服务密钥')
									await setOpenaiApiKey(key)
									setOpenaiApiKeyModified(false)
									messageApi?.success('推理服务密钥已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item
					label={
						<span>
							推理服务模型 <Tag>OpenAI Model Name</Tag>
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
									await setOpenaiModelName()
									setOpenaiModelNameModified(false)
									messageApi?.success('推理服务模型已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='openaiModelName'>
							<Input
								className='w-full'
								onChange={() => setOpenaiModelNameModified(true)}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={openaiModelNameModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								onClick={async () => {
									const model = form.getFieldValue('openaiModelName')
									if (!model) return messageApi?.error('请输入推理服务模型')
									await setOpenaiModelName(model)
									setOpenaiModelNameModified(false)
									messageApi?.success('推理服务模型已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item label='推理模型最大 Token 数'>
					<Space.Compact block>
						<Tooltip title='恢复默认值' color='blue'>
							<Button
								type='default'
								autoInsertSpace={false}
								icon={<ReloadOutlined />}
								onClick={async () => {
									await setMaxToken()
									setMaxTokenModified(false)
									messageApi?.success('推理模型最大 Token 数已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='maxToken'>
							<InputNumber
								style={{ width: '100%' }}
								onChange={() => setMaxTokenModified(true)}
								min={3_000}
								max={120_000}
								step={1_000}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={maxTokenModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								onClick={async () => {
									await setMaxToken(Number(form.getFieldValue('maxToken')))
									setMaxTokenModified(false)
									messageApi?.success('推理模型最大 Token 数已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
			</Form>
		</div>
	)
}

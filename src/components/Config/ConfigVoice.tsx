import {
	InfoCircleOutlined,
	ReloadOutlined,
	SaveOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useListenApi } from '../../lib/hooks/useListenApi.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'

export function ConfigVoice() {
	const setSpeakApi = useSpeakApi((state) => state.setSpeakApi)
	const speakApiList = useSpeakApi((state) => state.speakApiList)
	const currentSpeakApi = useSpeakApi((state) => state.currentSpeakApi)
	const f5TtsEndpoint = useSpeakApi((state) => state.f5TtsEndpoint)
	const fishSpeechEndpoint = useSpeakApi((state) => state.fishSpeechEndpoint)
	const setF5TtsEndpoint = useSpeakApi((state) => state.setF5TtsEndpoint)
	const setFishSpeechEndpoint = useSpeakApi(
		(state) => state.setFishSpeechEndpoint,
	)
	const setListenApi = useListenApi((state) => state.setListenApi)
	const listenApiList = useListenApi((state) => state.listenApiList)
	const currentListenApi = useListenApi((state) => state.currentListenApi)
	const messageApi = useStates((state) => state.messageApi)
	const [form] = Form.useForm()
	const [f5TtsEndpointModified, setF5TtsEndpointModified] = useState(false)
	const [fishSpeechEndpointModified, setFishSpeechEndpointModified] =
		useState(false)
	useEffect(() => form.setFieldsValue({ f5TtsEndpoint }), [f5TtsEndpoint, form])
	useEffect(
		() => form.setFieldsValue({ fishSpeechEndpoint }),
		[fishSpeechEndpoint, form],
	)

	return (
		<div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
			<Form form={form} layout='vertical'>
				<Form.Item
					label={
						<div className='flex gap-1'>
							<div>语音合成服务</div>
							<Tooltip
								color='blue'
								title='在连续语音对话时, Safari 浏览器可能会阻止应用直接播放音频, 建议使用 Chrome、Edge 或 Firefox 浏览器'
							>
								<InfoCircleOutlined />
							</Tooltip>
						</div>
					}
				>
					<Select
						options={speakApiList.map((name) => ({ label: name, value: name }))}
						value={currentSpeakApi}
						onChange={async (value) => {
							await setSpeakApi(value)
						}}
					/>
				</Form.Item>
				<Form.Item label='F5 TTS API Endpoint'>
					<Space.Compact block>
						<Tooltip title='恢复默认值' color='blue'>
							<Button
								type='default'
								autoInsertSpace={false}
								icon={<ReloadOutlined />}
								onClick={async () => {
									await setF5TtsEndpoint()
									setF5TtsEndpointModified(false)
									messageApi?.success('F5 TTS API Endpoint 已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='f5TtsEndpoint'>
							<Input onChange={() => setF5TtsEndpointModified(true)} />
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={f5TtsEndpointModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								icon={<SaveOutlined />}
								onClick={async () => {
									await setF5TtsEndpoint(form.getFieldValue('f5TtsEndpoint'))
									setF5TtsEndpointModified(false)
									messageApi?.success('F5 TTS API Endpoint 已更新')
								}}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item label='Fish Speech API Endpoint'>
					<Space.Compact block>
						<Tooltip title='恢复默认值' color='blue'>
							<Button
								type='default'
								autoInsertSpace={false}
								icon={<ReloadOutlined />}
								onClick={async () => {
									await setFishSpeechEndpoint()
									setFishSpeechEndpointModified(false)
									messageApi?.success('Fish Speech API Endpoint 已恢复默认值')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='fishSpeechEndpoint'>
							<Input onChange={() => setFishSpeechEndpointModified(true)} />
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={fishSpeechEndpointModified ? 'primary' : 'default'}
								autoInsertSpace={false}
								icon={<SaveOutlined />}
								onClick={async () => {
									await setFishSpeechEndpoint(
										form.getFieldValue('fishSpeechEndpoint'),
									)
									setFishSpeechEndpointModified(false)
									messageApi?.success('Fish Speech API Endpoint 已更新')
								}}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<hr className='border-t border-blue-900 mb-4' />
				<Form.Item label='语音识别服务'>
					<Select
						options={listenApiList.map((name) => ({
							label: name,
							value: name,
						}))}
						value={currentListenApi}
						onChange={async (value) => {
							await setListenApi(value)
						}}
					/>
				</Form.Item>
			</Form>
		</div>
	)
}

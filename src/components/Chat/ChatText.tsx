import emojiReg from 'emoji-regex'
import { flushSync } from 'react-dom'
import { sleep, uuid } from '../../lib/utils.ts'

import { type RefObject, useEffect, useRef, useState } from 'react'
import { useChatApi } from '../../lib/hooks/useChatApi.ts'
import { useListenApi } from '../../lib/hooks/useListenApi.ts'
import { useLive2dApi } from '../../lib/hooks/useLive2dApi.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { useVectorApi } from '../../lib/hooks/useVectorApi.ts'

import {
	ClearOutlined,
	DashboardOutlined,
	LoadingOutlined,
	RestOutlined,
} from '@ant-design/icons'
import { Sender } from '@ant-design/x'
import { Button, type GetRef, Popconfirm, Popover } from 'antd'
import { MessageBox } from './MessageBox.tsx'

export function ChatText({
	shortTermMemoryRef,
}: {
	shortTermMemoryRef: RefObject<ShortTermMemory[]>
}) {
	const disabled = useStates((state) => state.disabled)
	const setDisabled = useStates((state) => state.setDisabled)
	const messageApi = useStates((state) => state.messageApi)

	const qWeatherApiKey = usePlugins((state) => state.qWeatherApiKey)

	const chat = useChatApi((state) => state.chat)
	const usedToken = useChatApi((state) => state.usedToken)
	const setUsedToken = useChatApi((state) => state.setUsedToken)
	const openaiModelName = useChatApi((state) => state.openaiModelName)
	const addThinkCache = useChatApi((state) => state.addThinkCache)

	const vectorApi = useVectorApi((state) => state.vectorApi)

	const speak = useSpeakApi((state) => state.speak)
	const addAudioCache = useSpeakApi((state) => state.addAudioCache)

	const listen = useListenApi((state) => state.listen)

	const showTips = useLive2dApi((state) => state.showTips)
	const hideTips = useLive2dApi((state) => state.hideTips)
	const setTips = useLive2dApi((state) => state.setTips)

	const chatWithMemory = useMemory((state) => state.chatWithMemory)
	const updateMemory = useMemory((state) => state.updateMemory)
	const shortTermMemory = useMemory((state) => state.shortTermMemory)
	const setShortTermMemory = useMemory((state) => state.setShortTermMemory)
	const selfName = useMemory((state) => state.selfName)
	const [recognition, setRecognition] = useState<ReturnType<ListenApi> | null>(
		null,
	)

	const senderRef = useRef<GetRef<typeof Sender>>(null)
	useEffect(() => {
		if (shortTermMemory.length === 0) {
			senderRef.current?.focus()
		}
	}, [shortTermMemory])

	const messagesRef = useRef<HTMLDivElement>(null)
	// biome-ignore lint/correctness/useExhaustiveDependencies: 用于自然滚动到底部
	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight
		}
	}, [shortTermMemory])

	const [memoMaxHeight, setMemoMaxHeight] = useState<string>('0px')
	useEffect(() => {
		const initSenderHeight = senderRef.current?.nativeElement.clientHeight
		setMemoMaxHeight(`calc(100dvh - ${initSenderHeight}px - 11rem)`)
	}, [])

	const onChat = async (text: string) => {
		const prev = shortTermMemoryRef.current
		const time = Date.now()
		try {
			const input = [
				...prev,
				{ role: 'user', content: text, timestamp: time, uuid: uuid() },
			]
			await setShortTermMemory(input)
			setTips('......')
			showTips()
			const { result, tokens, output, think } = await chatWithMemory(
				chat,
				openaiModelName,
				input,
				async (input) => {
					let vec: number[] | undefined = undefined
					try {
						vec = await vectorApi(input)
					} catch {
						messageApi?.warning('输出向量化失败, 记忆提取功能将无法使用')
					}
					return vec
				},
				{ qWeatherApiKey },
			)
			if (think) {
				await addThinkCache({ timestamp: time, content: think })
			}
			await setUsedToken(tokens)
			const reg = /。|？|！|,|，|;|；|~|～|!|\?|\. |…|\n|\r|\r\n|:|：|……/
			const emoji = emojiReg()
			const tts =
				typeof speak === 'function'
					? speak(result.replace(emoji, '')).then(({ audio }) =>
							addAudioCache({ timestamp: time, audio }),
						)
					: Promise.resolve({ audio: null })
			flushSync(() =>
				setDisabled(
					<p className='flex justify-center items-center gap-[0.3rem]'>
						{selfName}回应中 <LoadingOutlined />
					</p>,
				),
			)
			let current = ''
			let steps = ''
			for (const w of result) {
				current += w
				await setShortTermMemory([
					...output,
					{
						role: 'assistant',
						content: current,
						timestamp: time,
						uuid: uuid(),
					},
				])
				await sleep(30)
				if (w.match(reg)) {
					setTips(steps + w)
					steps = ''
					await sleep(1000) // ChatVoice.tsx 那里会比这里慢一点, 是故意的
				} else {
					steps += w
					setTips(steps)
				}
			}
			hideTips(10)
			flushSync(() =>
				setDisabled(
					<p className='flex justify-center items-center gap-[0.3rem]'>
						等待更新记忆结束 <LoadingOutlined />
					</p>,
				),
			)
			await setUsedToken(tokens)
			flushSync(() =>
				setDisabled(
					<p className='flex justify-center items-center gap-[0.3rem]'>
						等待语音生成结束 <LoadingOutlined />
					</p>,
				),
			)
			await tts
			const newMemory = [
				...output,
				{ role: 'assistant', content: result, timestamp: time, uuid: uuid() },
			]
			await setShortTermMemory(newMemory)
			shortTermMemoryRef.current = newMemory
		} catch (error) {
			messageApi?.error(error instanceof Error ? error.message : '未知错误')
			await setShortTermMemory(prev)
		}
	}

	const [inputValue, setInputValue] = useState<string>('')

	return (
		<div className='w-full max-h-full relative overflow-hidden p-4 bg-white rounded-md border border-blue-900 gap-4 flex flex-col'>
			<div
				className='w-full overflow-auto border rounded-lg p-3 border-[#d9d9d9] hover:border-[#5794f7] transition-none'
				style={{ maxHeight: memoMaxHeight }}
				ref={messagesRef}
			>
				{shortTermMemory.length ? (
					<MessageBox />
				) : (
					<span className='text-gray-400'>无对话内容</span>
				)}
			</div>
			<Sender
				ref={senderRef}
				header={
					<div className='w-full flex justify-start items-center gap-2 p-2 pb-0'>
						<Popconfirm
							title={
								<span>
									系统会根据时间自动更新记忆
									<br />
									但您也可以通过本功能手动更新
									<br />
									您确定要立即更新记忆吗?
								</span>
							}
							onConfirm={async () => {
								try {
									flushSync(() =>
										setDisabled(
											<p className='flex justify-center items-center gap-[0.3rem]'>
												更新记忆中 <LoadingOutlined />
											</p>,
										),
									)
									await updateMemory(chat, openaiModelName, async (input) => {
										let vec: number[] | undefined = undefined
										try {
											vec = await vectorApi(input)
										} catch {
											messageApi?.warning('记忆索引失败, 请稍后手动索引')
										}
										return vec
									})
									shortTermMemoryRef.current = []
									messageApi?.success('记忆更新成功')
									setInputValue('')
								} catch (error) {
									messageApi?.error(
										error instanceof Error ? error.message : '未知错误',
									)
								} finally {
									setDisabled(false)
								}
							}}
							okText='确定'
							cancelText='取消'
						>
							<Button
								size='small'
								icon={<ClearOutlined />}
								disabled={disabled !== false || shortTermMemory.length === 0}
							>
								<span className='text-xs'>更新记忆</span>
							</Button>
						</Popconfirm>
						<Popconfirm
							title={
								<span>
									本操作将直接清除当前对话内容
									<br />
									不会更新记忆和自我概念
									<br />
									您确定要清除当前对话吗?
								</span>
							}
							onConfirm={async () => {
								try {
									flushSync(() =>
										setDisabled(
											<p className='flex justify-center items-center gap-[0.3rem]'>
												清除对话中 <LoadingOutlined />
											</p>,
										),
									)
									await setShortTermMemory([])
									await setUsedToken(undefined)
									shortTermMemoryRef.current = []
									messageApi?.success('对话已清除')
									setInputValue('')
								} catch (error) {
									messageApi?.error(
										error instanceof Error ? error.message : '未知错误',
									)
								} finally {
									setDisabled(false)
								}
							}}
							okText='确定'
							cancelText='取消'
						>
							<Button
								size='small'
								icon={<RestOutlined />}
								disabled={disabled !== false || shortTermMemory.length === 0}
							>
								<span className='text-xs'>清除当前对话</span>
							</Button>
						</Popconfirm>
						{typeof usedToken === 'number' && usedToken > 0 && (
							<Popover content={`上次词元用量: ${usedToken}`}>
								<Button
									size='small'
									icon={<DashboardOutlined />}
									disabled={disabled !== false}
								/>
							</Popover>
						)}
					</div>
				}
				onSubmit={async () => {
					const text = inputValue.trim()
					if (!text) {
						messageApi?.warning('请输入内容')
						return
					}
					flushSync(() =>
						setDisabled(
							<p className='flex justify-center items-center gap-[0.3rem]'>
								对话中 <LoadingOutlined />
							</p>,
						),
					)
					setInputValue('')
					await onChat(text).catch(() => setInputValue(text))
					flushSync(() => setDisabled(false))
				}}
				disabled={disabled !== false}
				loading={disabled !== false}
				value={inputValue}
				onChange={(value) => {
					setInputValue(value)
					setTimeout(() => {
						setMemoMaxHeight(
							`calc(100dvh - ${senderRef.current?.nativeElement.clientHeight}px - 11.5rem)`,
						)
					}, 10)
				}}
				submitType='shiftEnter'
				placeholder='按 Shift + Enter 发送消息'
				allowSpeech={
					listen
						? {
								recording: recognition !== null,
								onRecordingChange: async (recording) => {
									if (recording) {
										messageApi?.info('再次点击按钮结束说话')
										const recognition = listen()
										setRecognition(recognition)
										recognition.start()
										return
									}
									try {
										if (!recognition) {
											throw new Error('语音识别未初始化')
										}
										recognition.stop()
										const text = await recognition.result
										if (!text) {
											throw new Error('未识别到任何文字')
										}
										setInputValue(text)
									} catch (e) {
										messageApi?.warning(
											e instanceof Error
												? e.message
												: typeof e === 'string'
													? e
													: '未知错误',
										)
									} finally {
										setRecognition(null)
									}
								},
							}
						: undefined
				}
			/>
		</div>
	)
}

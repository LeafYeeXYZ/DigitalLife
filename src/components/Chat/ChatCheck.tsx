import { type RefObject, useEffect, useState } from 'react'
import { useChatApi } from '../../lib/hooks/useChatApi.ts'
import { useListenApi } from '../../lib/hooks/useListenApi.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { useVectorApi } from '../../lib/hooks/useVectorApi.ts'

import { LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export function ChatCheck({
	setReady,
	shortTermMemoryRef,
}: {
	setReady: (ready: boolean) => void
	shortTermMemoryRef: RefObject<ShortTermMemory[]>
}) {
	const { setDisabled, disabled, setForceAllowNav, messageApi } = useStates()
	const { qWeatherApiKey, testQWeatherApiKey } = usePlugins()
	const { testChat, chat, openaiModelName, setUsedToken } = useChatApi()
	const { vectorApi } = useVectorApi()
	const { testListen } = useListenApi()
	const { testSpeak } = useSpeakApi()
	const { shouldUpdateMemory, updateMemory } = useMemory()
	const [statusText, setStatusText] = useState<string>('加载中')
	const [statusError, setStatusError] = useState<boolean>(false)

	// 初始化
	useEffect(() => {
		if (statusText !== '加载中') {
			return
		}
		setForceAllowNav(false)
		// 加载服务
		Promise.all([
			testChat(),
			typeof testSpeak === 'function' ? testSpeak() : Promise.resolve(true),
			typeof testListen === 'function' ? testListen() : Promise.resolve(true),
			qWeatherApiKey ? testQWeatherApiKey() : Promise.resolve(true),
		])
			.then(async () => {
				if (shouldUpdateMemory()) {
					setDisabled(
						<p className='flex justify-center items-center gap-[0.3rem]'>
							更新记忆中 <LoadingOutlined />
						</p>,
					)
					setStatusText('更新记忆中')
					const { tokens } = await updateMemory(
						chat,
						openaiModelName,
						async (input) => {
							let vec: number[] | undefined = undefined
							try {
								vec = await vectorApi(input)
							} catch {
								messageApi?.warning('记忆索引失败, 请稍后手动索引')
							}
							return vec
						},
					)
					shortTermMemoryRef.current = []
					await setUsedToken(tokens)
				}
				return
			})
			.then(() => {
				setReady(true)
				setDisabled(
					disabled === true || disabled === '加载出错' ? false : disabled,
				)
			})
			.catch((e) => {
				setStatusError(true)
				setStatusText(e.message)
				setDisabled('加载出错')
				setForceAllowNav(true)
			})
	}, [
		setDisabled,
		testChat,
		testSpeak,
		testListen,
		setReady,
		statusText,
		disabled,
		shouldUpdateMemory,
		updateMemory,
		chat,
		qWeatherApiKey,
		openaiModelName,
		setUsedToken,
		setForceAllowNav,
		testQWeatherApiKey,
		shortTermMemoryRef,
		vectorApi,
		messageApi,
	])

	return (
		<div
			style={
				disabled === true || disabled === '加载出错'
					? {}
					: { animation: 'hideStart 1s forwards' }
			}
			className='flex bg-white gap-[0.3rem] justify-center items-center flex-col w-full max-h-full p-4 rounded-md border border-blue-900'
		>
			{statusError ? (
				<>
					<div>加载出错:</div>
					<div className='text-center'>{statusText}</div>
					<div>请检查服务状态或修改设置</div>
					<Button
						className='mt-[0.3rem]'
						onClick={() => {
							setStatusText('加载中')
							setStatusError(false)
						}}
					>
						点击重试
					</Button>
				</>
			) : (
				<>
					<div className='flex gap-[0.3rem] justify-center items-center'>
						{statusText} <LoadingOutlined />
					</div>
				</>
			)}
		</div>
	)
}

import {
	ApiOutlined,
	AudioOutlined,
	BlockOutlined,
	BookOutlined,
	BorderlessTableOutlined,
	BoxPlotOutlined,
	CloudSyncOutlined,
	CommentOutlined,
	ExportOutlined,
	FontSizeOutlined,
	IdcardOutlined,
	LayoutOutlined,
	LoadingOutlined,
	ReadOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { Menu, message } from 'antd'
import { type ReactNode, useEffect, useState } from 'react'
import { version } from '../package.json'
import { ChatIndex } from './components/Chat/ChatIndex.tsx'
import { ConfigCloud } from './components/Config/ConfigCloud.tsx'
import { ConfigLayout } from './components/Config/ConfigLayout.tsx'
import { ConfigMain } from './components/Config/ConfigMain.tsx'
import { ConfigPlugins } from './components/Config/ConfigPlugins.tsx'
import { ConfigVector } from './components/Config/ConfigVector.tsx'
import { ConfigVoice } from './components/Config/ConfigVoice.tsx'
import { Debug } from './components/Debug.tsx'
import { MemoryAction } from './components/Memory/MemoryAction.tsx'
import { MemoryDiary } from './components/Memory/MemoryDiary.tsx'
import { MemoryMain } from './components/Memory/MemoryMain.tsx'
import { env } from './lib/env.ts'
import { useIsMobile } from './lib/hooks/useIsMobile.ts'
import { useLive2dApi } from './lib/hooks/useLive2dApi.ts'
import { useMemory } from './lib/hooks/useMemory.ts'
import { useStates } from './lib/hooks/useStates.ts'
import { openLink } from './lib/utils.ts'

const DEFAULT_PAGE = 'chat-text'
const PAGES: Record<string, ReactNode> = {
	'memory-main': <MemoryMain />,
	'memory-diary': <MemoryDiary />,
	'memory-action': <MemoryAction />,
	'config-main': <ConfigMain />,
	'config-vector': <ConfigVector />,
	'config-service': <ConfigVoice />,
	'config-layout': <ConfigLayout />,
	'config-cloud': <ConfigCloud />,
	'config-plugins': <ConfigPlugins />,
	'chat-text': <ChatIndex to='text' />,
	'chat-voice': <ChatIndex to='voice' />,
}

export default function App() {
	const [messageApi, messageElement] = message.useMessage()
	const { setMessageApi, disabled, forceAllowNav } = useStates()
	const {
		setLive2dOpen,
		background,
		isFullScreen,
		live2dPositionY,
		live2dPositionX,
		setTips,
		showTips,
		hideTips,
	} = useLive2dApi()
	const { selfName, userName } = useMemory()
	const [current, setCurrent] = useState<string>(DEFAULT_PAGE)
	const isMobile = useIsMobile()

	// 显示欢迎消息
	useEffect(() => {
		if (sessionStorage.getItem('welcome-message-shown') === 'yes') {
			return
		}
		if (isMobile) {
			return
		}
		sessionStorage.setItem('welcome-message-shown', 'yes')
		const timer = setTimeout(() => {
			setTips(`${userName}, 我们又见面啦!`)
			showTips()
			hideTips(8)
		}, 1000)
		return () => {
			clearTimeout(timer)
		}
	}, [userName, setTips, showTips, hideTips, isMobile])

	// 加载消息通知
	useEffect(() => {
		setMessageApi(messageApi)
	}, [messageApi, setMessageApi])

	// 加载看板娘
	useEffect(() => {
		if (isMobile) {
			return
		}
		setLive2dOpen(true)
		return () => {
			setLive2dOpen(false)
		}
	}, [setLive2dOpen, isMobile])

	// 调整看板娘位置 (Y)
	useEffect(() => {
		// 容器位置
		const container = document.getElementById('live2d-container')
		if (!container) {
			messageApi.error('Live2d容器加载失败')
			return
		}
		if (live2dPositionY >= 0) {
			container.style.bottom = 'unset'
			container.style.top = `${live2dPositionY}px`
		} else {
			container.style.top = 'unset'
			container.style.bottom = `${-live2dPositionY}px`
		}
		// 对话框位置
		const message = document.getElementById('live2d-message')
		if (!message) {
			messageApi.error('Live2d消息框加载失败')
			return
		}
		const canvas = document.getElementById('live2d')
		if (!canvas) {
			messageApi.error('Live2d模型加载失败')
			return
		}
		const messageTop = canvas.clientHeight * 0.05 + 10
		message.style.top = `${messageTop}px`
		return () => {
			message.style.top = '0'
			container.style.top = '0'
			container.style.bottom = 'unset'
		}
	}, [live2dPositionY, messageApi])

	// 调整看板娘位置 (X) [消息框和模型X轴位置都是相对于容器的, 无需单独调整]
	useEffect(() => {
		const container = document.getElementById('live2d-container')
		if (!container) {
			messageApi.error('Live2d容器加载失败')
			return
		}
		container.style.right = `${-live2dPositionX}px`
		return () => {
			container.style.right = '0'
		}
	}, [live2dPositionX, messageApi])

	// 加载背景
	useEffect(() => {
		const element = document.getElementById('back')
		if (!(element instanceof HTMLImageElement)) {
			messageApi.error('背景图片加载失败')
			return
		}
		element.src = background
	}, [background, messageApi])

	// 可调整大小
	const LEFT_GAP = 450
	const RIGHT_GAP = 350
	const [x, setX] = useState<number>(LEFT_GAP)
	useEffect(() => {
		const bg = document.getElementById('back-container')
		if (!bg) {
			messageApi.error('背景容器加载失败')
			return
		}
		const l2d = document.getElementById('live2d-container')
		if (!l2d) {
			messageApi.error('Live2d容器加载失败')
			return
		}
		if (isFullScreen) {
			bg.style.width = '100dvw'
			l2d.style.width = `calc(100dvw - ${x}px)`
		} else if (isMobile) {
			bg.style.width = '0'
			l2d.style.width = '0'
		} else {
			bg.style.width = `calc(100dvw - ${x}px)`
			l2d.style.width = `calc(100dvw - ${x}px)`
		}
	}, [x, isMobile, isFullScreen, messageApi])

	// 切换移动模式时发送提示
	useEffect(() => {
		isMobile && messageApi.info('当前为屏幕宽度较小, 将不会显示 Live2D 模型')
	}, [isMobile, messageApi])

	return (
		<main className='w-dvw h-dvh overflow-hidden'>
			{!isMobile && (
				<div
					className='fixed top-1/2 left-0 w-[0.4rem] h-12 z-50 cursor-ew-resize border border-blue-900 rounded-full bg-blue-50 opacity-50 hover:opacity-100 translate-y-[-50%]'
					style={{ marginLeft: `calc(${x}px - 0.25rem)` }}
					draggable
					onDragStart={(e) => {
						// @ts-expect-error 类型提示错误, 运行无问题
						e.target.style.opacity = '0'
					}}
					onDragEnd={(e) => {
						// @ts-expect-error 类型提示错误, 运行无问题
						e.target.style.opacity = '1'
					}}
					onDrag={(e) => {
						if (
							e.clientX < LEFT_GAP ||
							e.clientX > window.innerWidth - RIGHT_GAP
						) {
							return
						}
						setX(e.clientX)
					}}
				/>
			)}
			<div
				className='h-dvh overflow-hidden float-left'
				style={{ width: isMobile ? '100dvw' : `${x}px` }}
			>
				<div className='w-full h-full overflow-hidden grid grid-rows-[1fr_3.2rem_2.8rem]'>
					{/* Page */}
					<div
						className='w-full h-full overflow-hidden flex flex-col justify-center items-center py-4'
						style={{
							paddingLeft: isMobile ? '1rem' : '1.5rem',
							paddingRight: isMobile ? '1rem' : '1.5rem',
						}}
					>
						<div className='w-full overflow-hidden'>{PAGES[current]}</div>
					</div>
					{/* Nav */}
					<div className='w-full h-full flex justify-center items-center'>
						<div className='flex justify-center items-center bg-white border border-blue-900 rounded-md overflow-hidden'>
							<Menu
								className='border-none justify-center bg-transparent'
								mode='horizontal'
								selectedKeys={[current]}
								onClick={({ key }) => setCurrent(key)}
								disabled={disabled !== false && !forceAllowNav}
								items={[
									{
										key: 'memory',
										label: '记忆',
										icon: <BookOutlined />,
										children: [
											{
												key: 'memory-main',
												label: '名字和自我',
												icon: <IdcardOutlined />,
											},
											{
												key: 'memory-diary',
												label: `${selfName}的日记本`,
												icon: <ReadOutlined />,
											},
											{
												key: 'memory-action',
												label: '导入和导出',
												icon: <CloudSyncOutlined />,
											},
										],
									},
									{
										key: 'chat',
										label: '聊天',
										icon: <CommentOutlined />,
										children: [
											{
												key: 'chat-text',
												label: '文字语音聊天',
												icon: <FontSizeOutlined />,
											},
											{
												key: 'chat-voice',
												label: '连续语音对话',
												icon: <AudioOutlined />,
											},
										],
									},
									{
										key: 'config',
										label: '设置',
										icon: <SettingOutlined />,
										children: [
											{
												key: 'config-main',
												label: '推理服务设置',
												icon: <BlockOutlined />,
											},
											{
												key: 'config-vector',
												label: '嵌入服务设置',
												icon: <BoxPlotOutlined />,
											},
											{
												key: 'config-service',
												label: '语音服务设置',
												icon: <ApiOutlined />,
											},
											{
												key: 'config-layout',
												label: '自定义设置',
												icon: <LayoutOutlined />,
											},
											{
												key: 'config-cloud',
												label: '云存储设置',
												icon: <CloudSyncOutlined />,
											},
											{
												key: 'config-plugins',
												label: '插件设置',
												icon: <BorderlessTableOutlined />,
											},
										],
									},
								]}
							/>
						</div>
					</div>
					{/* Footer */}
					<div className='w-full h-full flex items-center justify-center text-xs'>
						<div className='grid grid-cols-[5.8rem_1fr_5.8rem] gap-3'>
							<div className='flex justify-center items-center border border-blue-900 rounded-md py-[0.1rem] bg-white'>
								<div className='mr-1'>数字生命</div>
								<div>{version}</div>
							</div>
							<div className='flex justify-center items-center border border-blue-900 rounded-md px-[0.4rem] py-[0.1rem] bg-white'>
								<div className='mr-1'>当前状态:</div>
								<div className='flex justify-center items-center'>
									{disabled === false ? (
										'空闲'
									) : disabled === true ? (
										<div className='flex justify-center items-center gap-[0.3rem]'>
											<div>加载中</div>
											<div className='flex items-center justify-center'>
												<LoadingOutlined />
											</div>
										</div>
									) : (
										disabled
									)}
								</div>
							</div>
							<button
								type='button'
								className='cursor-pointer flex justify-center items-center border border-blue-900 rounded-md py-[0.1rem] bg-white'
								onClick={() =>
									openLink('https://github.com/LeafYeeXYZ/DigitalLife')
								}
							>
								<div className='mr-1'>GitHub</div>
								<ExportOutlined />
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Widget */}
			{env.VITE_DEBUG_COMPONENT ? <Debug /> : undefined}
			{/* Context Holder */}
			{messageElement}
		</main>
	)
}

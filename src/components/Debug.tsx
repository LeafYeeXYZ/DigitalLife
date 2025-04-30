import { Button, Popover } from 'antd'
import { useMemory } from '../lib/hooks/useMemory.ts'
import { useStates } from '../lib/hooks/useStates.ts'

export function Debug() {
	const resetAllMemory = useMemory((state) => state.resetAllMemory)
	const archivedMemory = useMemory((state) => state.archivedMemory)
	const shortTermMemory = useMemory((state) => state.shortTermMemory)
	const setShortTermMemory = useMemory((state) => state.setShortTermMemory)
	const messageApi = useStates((state) => state.messageApi)

	return (
		<Popover
			trigger={['hover', 'click']}
			title='调试信息'
			content={
				<div className='flex flex-col items-center justify-center gap-2 text-sm'>
					<div>已存档记忆数量: {archivedMemory.length}</div>
					<div>
						函数调用信息:{' '}
						{JSON.stringify(
							shortTermMemory
								.filter((item) => item.tool_calls?.length)
								.map((item) => item.tool_calls?.[0]),
						)}
					</div>
					<Button
						block
						onClick={async () => {
							await setShortTermMemory(shortTermMemory.slice(0, -1))
							messageApi?.success('已删除最后一条短时记忆')
						}}
					>
						删除最后一条短时记忆
					</Button>
					<Button
						block
						danger
						onClick={async () => {
							await resetAllMemory()
							messageApi?.success('已重置记忆')
						}}
						disabled
					>
						重置记忆
					</Button>
					<Button
						block
						onClick={() => {
							navigator.geolocation.getCurrentPosition(
								(position) => {
									messageApi?.info(
										`当前位置: ${position.coords.latitude}, ${position.coords.longitude}`,
									)
								},
								(error) => {
									messageApi?.error(`获取位置失败: ${error.message}`)
								},
							)
						}}
					>
						获取位置
					</Button>
				</div>
			}
		>
			<div className='fixed w-8 h-8 rounded-md border border-blue-500 bg-blue-50 top-2 left-2 opacity-50 hover:opacity-100 transition-opacity' />
		</Popover>
	)
}

import { FileImageOutlined, UndoOutlined } from '@ant-design/icons'
import { Button, Form, Select, Slider, Upload } from 'antd'
import { useLive2dApi } from '../../lib/hooks/useLive2dApi.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useStates } from '../../lib/hooks/useStates.ts'
import { toBase64 } from '../../lib/utils.ts'

export function ConfigLayout() {
	const {
		setLoadLive2d,
		live2dList,
		live2dName,
		setBackground,
		isFullScreen,
		setIsFullScreen,
		live2dPositionY,
		setLive2dPositionY,
		live2dPositionX,
		setLive2dPositionX,
	} = useLive2dApi()
	const { messageApi } = useStates()
	const { selfName } = useMemory()

	return (
		<div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
			<Form layout='vertical'>
				<Form.Item label='聊天形象'>
					<Select
						options={live2dList.map((name) => ({
							label: name.replace('{name}', selfName),
							value: name,
						}))}
						defaultValue={live2dName}
						onChange={async (value) => {
							await setLoadLive2d(value)
						}}
					/>
				</Form.Item>
				<Form.Item
					label={`模型垂直位置${live2dPositionY === 0 ? '' : ` [${live2dPositionY > 0 ? `向下偏移${live2dPositionY}像素` : `向上偏移${-live2dPositionY}像素`}]`}`}
				>
					<Slider
						min={-300}
						max={300}
						step={5}
						defaultValue={live2dPositionY}
						onChange={(value) => {
							setLive2dPositionY(value)
						}}
					/>
				</Form.Item>
				<Form.Item
					label={`模型水平位置${live2dPositionX === 0 ? '' : ` [${live2dPositionX > 0 ? `向右偏移${live2dPositionX}像素` : `向左偏移${-live2dPositionX}像素`}]`}`}
				>
					<Slider
						min={-600}
						max={600}
						step={10}
						defaultValue={live2dPositionX}
						onChange={(value) => {
							setLive2dPositionX(value)
						}}
					/>
				</Form.Item>
				<Form.Item label='背景图片'>
					<div className='flex justify-between flex-col items-center gap-4'>
						<Upload.Dragger
							showUploadList={false}
							className='w-full'
							accept='.jpg,.jpeg,.png'
							beforeUpload={async (file) => {
								try {
									const base64 = toBase64(await file.arrayBuffer())
									await setBackground(`data:${file.type};base64,${base64}`)
									messageApi?.success('背景设置成功')
								} catch (e) {
									messageApi?.error(
										`背景设置失败: ${e instanceof Error ? e.message : e}`,
									)
								}
								return false
							}}
						>
							<Button type='text' block icon={<FileImageOutlined />}>
								上传背景
							</Button>
							<p className='text-xs mt-[0.3rem]'>
								可点击上传或直接拖拽文件到此处
							</p>
						</Upload.Dragger>
						<Button
							className='w-full'
							block
							icon={<UndoOutlined />}
							onClick={async () => {
								await setBackground()
								messageApi?.success('已恢复默认背景')
							}}
						>
							恢复默认背景
						</Button>
					</div>
				</Form.Item>
				<Form.Item label='背景图片显示区域'>
					<Select
						options={[
							{ label: '全屏', value: true },
							{ label: '模型区域', value: false },
						]}
						defaultValue={isFullScreen}
						onChange={async (value) => {
							await setIsFullScreen(value)
						}}
					/>
				</Form.Item>
			</Form>
		</div>
	)
}

import {
	CloudDownloadOutlined,
	CloudUploadOutlined,
	DeleteOutlined,
	ExportOutlined,
	ImportOutlined,
	SaveOutlined,
} from '@ant-design/icons'
import {
	Button,
	Form,
	Input,
	Popconfirm,
	Popover,
	Space,
	Tooltip,
	Upload,
} from 'antd'
import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { useStates } from '../../lib/hooks/useStates.ts'

export function MemoryAction() {
	const resetAllMemory = useMemory((state) => state.resetAllMemory)
	const saveAllMemory = useMemory((state) => state.saveAllMemory)
	const importAllMemory = useMemory((state) => state.importAllMemory)
	const exportAllMemory = useMemory((state) => state.exportAllMemory)

	const setS3MemoryKey = usePlugins((state) => state.setS3MemoryKey)
	const s3MemoryKey = usePlugins((state) => state.s3MemoryKey)
	const putToS3 = usePlugins((state) => state.putToS3)
	const getFromS3 = usePlugins((state) => state.getFromS3)

	const messageApi = useStates((state) => state.messageApi)
	const disabled = useStates((state) => state.disabled)
	const setDisabled = useStates((state) => state.setDisabled)

	const [s3MemoryKeyModified, setS3MemoryKeyModified] = useState(false)

	const [openDeleteMemory, setOpenDeleteMemory] = useState<boolean>(false)
	const deleteMemoryText = useRef<string>('')
	const [form] = Form.useForm()

	return (
		<div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					s3MemoryKey,
				}}
			>
				<Form.Item label='导出记忆'>
					<Button
						block
						icon={<ExportOutlined />}
						onClick={async () => {
							await saveAllMemory()
								.then((path) => messageApi?.success(`记忆已导出至 ${path}`))
								.catch(() => {})
						}}
					>
						导出记忆
					</Button>
				</Form.Item>
				<Form.Item label='导入记忆'>
					<Upload.Dragger
						showUploadList={false}
						accept='.json'
						beforeUpload={async (file) => {
							try {
								const json = await file.text()
								await importAllMemory(json)
								messageApi?.success('记忆导入成功')
							} catch (e) {
								messageApi?.error(
									`记忆导入失败: ${e instanceof Error ? e.message : e}`,
								)
							}
							return false
						}}
					>
						<Button type='text' block icon={<ImportOutlined />}>
							导入记忆
						</Button>
						<p className='text-xs mt-[0.3rem]'>
							可点击上传或直接拖拽文件到此处
						</p>
					</Upload.Dragger>
				</Form.Item>
				<Form.Item label='重置记忆'>
					<Popover
						title='确定要重置所有记忆吗, 此操作无法撤销'
						trigger='click'
						open={openDeleteMemory}
						onOpenChange={setOpenDeleteMemory}
						content={
							<>
								<div className='mb-3'>
									<Input
										placeholder='请输入"删除所有记忆"后点击确定'
										onChange={(e) => {
											deleteMemoryText.current = e.target.value
										}}
									/>
								</div>
								<div className='flex justify-between items-center gap-3'>
									<Button
										block
										onClick={async () => {
											if (deleteMemoryText.current === '删除所有记忆') {
												await resetAllMemory()
												messageApi?.success('已重置所有记忆')
											} else {
												messageApi?.error('输入错误')
											}
											setOpenDeleteMemory(false)
										}}
									>
										确定
									</Button>
									<Button
										block
										type='primary'
										onClick={() => setOpenDeleteMemory(false)}
									>
										取消
									</Button>
								</div>
							</>
						}
					>
						<Button block danger icon={<DeleteOutlined />}>
							重置所有记忆
						</Button>
					</Popover>
				</Form.Item>
				<hr className='border-t border-blue-900 mb-4' />
				<Form.Item label='云存储中用于存储记忆的键名'>
					<Space.Compact block>
						<Tooltip title='清除已保存的值' color='blue'>
							<Button
								icon={<DeleteOutlined />}
								onClick={async () => {
									await setS3MemoryKey()
									setS3MemoryKeyModified(false)
									form.setFieldsValue({ s3MemoryKey: '' })
									messageApi?.success('记忆键名已清除')
								}}
							/>
						</Tooltip>
						<Form.Item noStyle name='s3MemoryKey'>
							<Input
								className='w-full'
								onChange={() => setS3MemoryKeyModified(true)}
							/>
						</Form.Item>
						<Tooltip title='保存修改' color='blue'>
							<Button
								type={s3MemoryKeyModified ? 'primary' : 'default'}
								onClick={async () => {
									const key = form.getFieldValue('s3MemoryKey')
									await setS3MemoryKey(key || '')
									setS3MemoryKeyModified(false)
									messageApi?.success('记忆键名已更新')
								}}
								icon={<SaveOutlined />}
							/>
						</Tooltip>
					</Space.Compact>
				</Form.Item>
				<Form.Item>
					<div className='flex justify-between items-center gap-4'>
						<Popconfirm
							title='此操作将覆盖云端记忆，确定要继续吗？'
							onConfirm={async () => {
								if (!s3MemoryKey) {
									messageApi?.error('请先设置用于存储记忆的键名')
									return
								}
								try {
									flushSync(() => setDisabled('上传记忆中'))
									const memory = await exportAllMemory()
									await putToS3(s3MemoryKey, memory)
									messageApi?.success(`记忆已上传至 ${s3MemoryKey} 中`)
								} catch (e) {
									messageApi?.error(
										`记忆上传失败: ${e instanceof Error ? e.message : e}`,
									)
								} finally {
									setDisabled(false)
								}
							}}
							okText='确定'
							cancelText='取消'
						>
							<Button
								block
								disabled={
									disabled === '下载记忆中' || disabled === '上传记忆中'
								}
								loading={disabled === '上传记忆中'}
								icon={<CloudUploadOutlined />}
							>
								上传记忆至云端
							</Button>
						</Popconfirm>
						<Popconfirm
							title='此操作将覆盖本地记忆，确定要继续吗？'
							onConfirm={async () => {
								if (!s3MemoryKey) {
									messageApi?.error('请先设置用于存储记忆的键名')
									return
								}
								try {
									flushSync(() => setDisabled('下载记忆中'))
									const memory = await getFromS3(s3MemoryKey)
									await importAllMemory(memory || '')
									messageApi?.success(`已从 ${s3MemoryKey} 中导入记忆`)
								} catch (e) {
									messageApi?.error(
										`记忆下载失败: ${e instanceof Error ? e.message : e}`,
									)
								} finally {
									setDisabled(false)
								}
							}}
							okText='确定'
							cancelText='取消'
						>
							<Button
								block
								disabled={
									disabled === '上传记忆中' || disabled === '下载记忆中'
								}
								loading={disabled === '下载记忆中'}
								icon={<CloudDownloadOutlined />}
							>
								从云端导入记忆
							</Button>
						</Popconfirm>
					</div>
				</Form.Item>
			</Form>
		</div>
	)
}

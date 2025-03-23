import { Button, Form, Input, Popconfirm, Space } from 'antd'
import { useState } from 'react'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { useStates } from '../../lib/hooks/useStates.ts'

export function MemoryMain() {
	const userName = useMemory((state) => state.userName)
	const selfName = useMemory((state) => state.selfName)
	const setUserName = useMemory((state) => state.setUserName)
	const setSelfName = useMemory((state) => state.setSelfName)
	const memoryAboutSelf = useMemory((state) => state.memoryAboutSelf)
	const memoryAboutUser = useMemory((state) => state.memoryAboutUser)
	const messageApi = useStates((state) => state.messageApi)

	const [form] = Form.useForm()
	const [nameModified, setNameModified] = useState(false)

	return (
		<div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					userName,
					selfName,
				}}
			>
				<Form.Item label='你和他的名字'>
					<Space.Compact block>
						<Form.Item noStyle name='userName'>
							<Input
								addonBefore='你叫'
								placeholder='请输入'
								onChange={() => setNameModified(true)}
							/>
						</Form.Item>
						<Form.Item noStyle name='selfName'>
							<Input
								addonBefore='他叫'
								placeholder='请输入'
								onChange={() => setNameModified(true)}
							/>
						</Form.Item>
						<Popconfirm
							title={
								<span>
									名字是你们之间的重要记忆
									<br />
									强烈建议不要中途轻易修改
									<br />
									您确定要修改吗？
								</span>
							}
							onConfirm={async () => {
								await setUserName(form.getFieldValue('userName'))
								await setSelfName(form.getFieldValue('selfName'))
								setNameModified(false)
								messageApi?.success('更新姓名成功')
							}}
							okText='确定'
							cancelText='取消'
						>
							<Button
								type={nameModified ? 'primary' : 'default'}
								autoInsertSpace={false}
							>
								保存
							</Button>
						</Popconfirm>
					</Space.Compact>
				</Form.Item>
				<Form.Item label={`${selfName}关于自己的记忆`}>
					<div className='w-full border rounded-md p-2 border-[#d9d9d9] hover:border-[#5794f7] transition-all'>
						{memoryAboutSelf || '没有记忆'}
					</div>
				</Form.Item>
				<Form.Item label={`${selfName}关于你的记忆`}>
					<div className='w-full border rounded-md p-2 border-[#d9d9d9] hover:border-[#5794f7] transition-all'>
						{memoryAboutUser || '没有记忆'}
					</div>
				</Form.Item>
			</Form>
		</div>
	)
}

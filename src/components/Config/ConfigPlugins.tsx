import { useStates } from '../../lib/hooks/useStates.ts'
import { useMemory } from '../../lib/hooks/useMemory.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { useState, useEffect } from 'react'

import { Form, Input, Space, Button, Tooltip } from 'antd'
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons'

export function ConfigPlugins() {
  const { messageApi } = useStates()
  const { selfName } = useMemory()
  const { qWeatherApiKey, setQWeatherApiKey } = usePlugins()
  const [form] = Form.useForm()
  const [qWeatherApiKeyModified, setQWeatherApiKeyModified] = useState(false)
  useEffect(
    () => form.setFieldsValue({ qWeatherApiKey }),
    [qWeatherApiKey, form],
  )

  return (
    <div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
      <Form form={form} layout='vertical'>
        <Form.Item label='和风天气 API Key'>
          <Space.Compact block>
            <Tooltip title='清除' color='blue'>
              <Button
                type='default'
                autoInsertSpace={false}
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await setQWeatherApiKey()
                  setQWeatherApiKeyModified(false)
                  messageApi?.success('和风天气 API Key 已清除')
                }}
              />
            </Tooltip>
            <Form.Item noStyle name='qWeatherApiKey'>
              <Input.Password
                className='w-full'
                onChange={() => setQWeatherApiKeyModified(true)}
                placeholder={`设置后, ${selfName}将联网获取天气信息`}
              />
            </Form.Item>
            <Tooltip title='保存修改' color='blue'>
              <Button
                type={qWeatherApiKeyModified ? 'primary' : 'default'}
                autoInsertSpace={false}
                onClick={async () => {
                  const apiKey = form.getFieldValue('qWeatherApiKey')
                  if (!apiKey)
                    return messageApi?.error('请输入和风天气 API Key')
                  await setQWeatherApiKey(apiKey)
                  setQWeatherApiKeyModified(false)
                  messageApi?.success('和风天气 API Key 已更新')
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

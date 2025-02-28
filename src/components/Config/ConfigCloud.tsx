import { useStates } from '../../lib/hooks/useStates.ts'
import { usePlugins } from '../../lib/hooks/usePlugins.ts'
import { useState } from 'react'
import { useChatApi } from '../../lib/hooks/useChatApi.ts'
import { useSpeakApi } from '../../lib/hooks/useSpeakApi.ts'
import { useVectorApi } from '../../lib/hooks/useVectorApi.ts'

import { flushSync } from 'react-dom'

import { Form, Button, Input, Space, Tooltip, Popconfirm, Popover } from 'antd'
import {
  DeleteOutlined,
  SaveOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

export function ConfigCloud() {
  const { messageApi, disabled, setDisabled } = useStates()
  const {
    s3Endpoint,
    s3AccessKey,
    s3SecretKey,
    s3BucketName,
    s3ConfigKey,
    setS3Endpoint,
    setS3AccessKey,
    setS3SecretKey,
    setS3BucketName,
    setS3ConfigKey,
    putToS3,
    getFromS3,
  } = usePlugins()
  const {
    openaiEndpoint,
    openaiApiKey,
    openaiModelName,
    setOpenaiEndpoint,
    setOpenaiApiKey,
    setOpenaiModelName,
  } = useChatApi()
  const {
    fishSpeechEndpoint,
    f5TtsEndpoint,
    setFishSpeechEndpoint,
    setF5TtsEndpoint,
  } = useSpeakApi()
  const { jinaApiKey, jinaEndpoint, setJinaApiKey, setJinaEndpoint } =
    useVectorApi()

  const [form] = Form.useForm()
  const [s3EndpointModified, setS3EndpointModified] = useState(false)
  const [s3AccessKeyModified, setS3AccessKeyModified] = useState(false)
  const [s3SecretKeyModified, setS3SecretKeyModified] = useState(false)
  const [s3BucketNameModified, setS3BucketNameModified] = useState(false)
  const [s3ConfigKeyModified, setS3ConfigKeyModified] = useState(false)

  return (
    <div className='w-full bg-white border border-blue-900 rounded-md px-5 pb-0 pt-4 overflow-auto max-h-full'>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          s3Endpoint,
          s3AccessKey,
          s3SecretKey,
          s3BucketName,
          s3ConfigKey,
        }}
      >
        <Form.Item label='S3 Endpoint'>
          <Space.Compact block>
            <Tooltip title='清除已保存的值' color='blue'>
              <Button
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await setS3Endpoint()
                  setS3EndpointModified(false)
                  form.setFieldsValue({ s3Endpoint: '' })
                  messageApi?.success('S3 Endpoint 已清除')
                }}
              />
            </Tooltip>
            <Form.Item noStyle name='s3Endpoint'>
              <Input
                className='w-full'
                onChange={() => setS3EndpointModified(true)}
              />
            </Form.Item>
            <Tooltip title='保存修改' color='blue'>
              <Button
                type={s3EndpointModified ? 'primary' : 'default'}
                onClick={async () => {
                  const endpoint = form.getFieldValue('s3Endpoint')
                  await setS3Endpoint(endpoint || '')
                  setS3EndpointModified(false)
                  messageApi?.success('S3 Endpoint 已更新')
                }}
                icon={<SaveOutlined />}
              />
            </Tooltip>
          </Space.Compact>
        </Form.Item>
        <Form.Item label='S3 Access Key'>
          <Space.Compact block>
            <Tooltip title='清除已保存的值' color='blue'>
              <Button
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await setS3AccessKey()
                  setS3AccessKeyModified(false)
                  form.setFieldsValue({ s3AccessKey: '' })
                  messageApi?.success('S3 Access Key 已清除')
                }}
              />
            </Tooltip>
            <Form.Item noStyle name='s3AccessKey'>
              <Input.Password
                className='w-full'
                onChange={() => setS3AccessKeyModified(true)}
              />
            </Form.Item>
            <Tooltip title='保存修改' color='blue'>
              <Button
                type={s3AccessKeyModified ? 'primary' : 'default'}
                onClick={async () => {
                  const accessKey = form.getFieldValue('s3AccessKey')
                  await setS3AccessKey(accessKey || '')
                  setS3AccessKeyModified(false)
                  messageApi?.success('S3 Access Key 已更新')
                }}
                icon={<SaveOutlined />}
              />
            </Tooltip>
          </Space.Compact>
        </Form.Item>
        <Form.Item label='S3 Secret Key'>
          <Space.Compact block>
            <Tooltip title='清除已保存的值' color='blue'>
              <Button
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await setS3SecretKey()
                  setS3SecretKeyModified(false)
                  form.setFieldsValue({ s3SecretKey: '' })
                  messageApi?.success('S3 Secret Key 已清除')
                }}
              />
            </Tooltip>
            <Form.Item noStyle name='s3SecretKey'>
              <Input.Password
                className='w-full'
                onChange={() => setS3SecretKeyModified(true)}
              />
            </Form.Item>
            <Tooltip title='保存修改' color='blue'>
              <Button
                type={s3SecretKeyModified ? 'primary' : 'default'}
                onClick={async () => {
                  const secretKey = form.getFieldValue('s3SecretKey')
                  await setS3SecretKey(secretKey || '')
                  setS3SecretKeyModified(false)
                  messageApi?.success('S3 Secret Key 已更新')
                }}
                icon={<SaveOutlined />}
              />
            </Tooltip>
          </Space.Compact>
        </Form.Item>
        <Form.Item label='S3 Bucket Name'>
          <Space.Compact block>
            <Tooltip title='清除已保存的值' color='blue'>
              <Button
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await setS3BucketName()
                  setS3BucketNameModified(false)
                  form.setFieldsValue({ s3BucketName: '' })
                  messageApi?.success('S3 Bucket Name 已清除')
                }}
              />
            </Tooltip>
            <Form.Item noStyle name='s3BucketName'>
              <Input
                className='w-full'
                onChange={() => setS3BucketNameModified(true)}
              />
            </Form.Item>
            <Tooltip title='保存修改' color='blue'>
              <Button
                type={s3BucketNameModified ? 'primary' : 'default'}
                onClick={async () => {
                  const bucketName = form.getFieldValue('s3BucketName')
                  await setS3BucketName(bucketName || '')
                  setS3BucketNameModified(false)
                  messageApi?.success('S3 Bucket Name 已更新')
                }}
                icon={<SaveOutlined />}
              />
            </Tooltip>
          </Space.Compact>
        </Form.Item>
        <hr className='border-t border-blue-900 mb-4' />
        <Form.Item
          label={
            <span className='text-gray-500'>
              云存储中用于存储设置的键名
              <Popover
                content={
                  <div>
                    仅会存储: 推理服务地址、密钥、模型; 嵌入服务地址、密钥;
                    语音生成服务地址
                  </div>
                }
              >
                <InfoCircleOutlined className='ml-[0.3rem]' />
              </Popover>
            </span>
          }
        >
          <Space.Compact block>
            <Tooltip title='清除已保存的值' color='blue'>
              <Button
                icon={<DeleteOutlined />}
                onClick={async () => {
                  await setS3ConfigKey()
                  setS3ConfigKeyModified(false)
                  form.setFieldsValue({ s3ConfigKey: '' })
                  messageApi?.success('配置键名已清除')
                }}
              />
            </Tooltip>
            <Form.Item noStyle name='s3ConfigKey'>
              <Input
                className='w-full'
                onChange={() => setS3ConfigKeyModified(true)}
              />
            </Form.Item>
            <Tooltip title='保存修改' color='blue'>
              <Button
                type={s3ConfigKeyModified ? 'primary' : 'default'}
                onClick={async () => {
                  const configKey = form.getFieldValue('s3ConfigKey')
                  await setS3ConfigKey(configKey || '')
                  setS3ConfigKeyModified(false)
                  messageApi?.success('配置键名已更新')
                }}
                icon={<SaveOutlined />}
              />
            </Tooltip>
          </Space.Compact>
        </Form.Item>
        <Form.Item>
          <div className='flex justify-between items-center gap-4'>
            <Popconfirm
              title='此操作将覆盖云端配置，确定要继续吗？'
              onConfirm={async () => {
                if (!s3ConfigKey) {
                  messageApi?.error('请先设置用于存储配置的键名')
                  return
                }
                try {
                  flushSync(() => setDisabled('上传配置中'))
                  const config = JSON.stringify({
                    openaiEndpoint,
                    openaiApiKey,
                    openaiModelName,
                    fishSpeechEndpoint,
                    f5TtsEndpoint,
                    jinaApiKey,
                    jinaEndpoint,
                  })
                  await putToS3(s3ConfigKey, config)
                  messageApi?.success(`配置已上传至 ${s3ConfigKey} 中`)
                } catch (e) {
                  messageApi?.error(
                    `配置上传失败: ${e instanceof Error ? e.message : e}`,
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
                  disabled === '下载配置中' || disabled === '上传配置中'
                }
                loading={disabled === '上传配置中'}
                icon={<CloudUploadOutlined />}
              >
                上传配置至云端
              </Button>
            </Popconfirm>
            <Popconfirm
              title='此操作将覆盖本地配置，确定要继续吗？'
              onConfirm={async () => {
                if (!s3ConfigKey) {
                  messageApi?.error('请先设置用于存储配置的键名')
                  return
                }
                try {
                  flushSync(() => setDisabled('下载配置中'))
                  const config = await getFromS3(s3ConfigKey)
                  const data = JSON.parse(config || '{}')
                  data.openaiEndpoint && setOpenaiEndpoint(data.openaiEndpoint)
                  data.openaiApiKey && setOpenaiApiKey(data.openaiApiKey)
                  data.openaiModelName &&
                    setOpenaiModelName(data.openaiModelName)
                  data.fishSpeechEndpoint &&
                    setFishSpeechEndpoint(data.fishSpeechEndpoint)
                  data.f5TtsEndpoint && setF5TtsEndpoint(data.f5TtsEndpoint)
                  data.jinaApiKey && setJinaApiKey(data.jinaApiKey)
                  data.jinaEndpoint && setJinaEndpoint(data.jinaEndpoint)
                  messageApi?.success(`已从 ${s3ConfigKey} 中导入配置`)
                } catch (e) {
                  messageApi?.error(
                    `配置下载失败: ${e instanceof Error ? e.message : e}`,
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
                  disabled === '上传配置中' || disabled === '下载配置中'
                }
                loading={disabled === '下载配置中'}
                icon={<CloudDownloadOutlined />}
              >
                从云端导入配置
              </Button>
            </Popconfirm>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { create } from 'zustand'
import { get, getWeather, set } from '../utils.ts'

type API = {
	setQWeatherApiKey: (apiKey?: string) => Promise<void>
	testQWeatherApiKey: () => Promise<boolean>

	setS3Endpoint: (endpoint?: string) => Promise<void>
	setS3AccessKey: (accessKey?: string) => Promise<void>
	setS3SecretKey: (secretKey?: string) => Promise<void>
	setS3BucketName: (bucketName?: string) => Promise<void>
	setS3MemoryKey: (key?: string) => Promise<void>
	setS3ConfigKey: (key?: string) => Promise<void>
	getFromS3: (key: string) => Promise<string>
	putToS3: (key: string, value: string) => Promise<void>
} & Plugins

const qWeatherApiKey = (await get('qweather_api_key')) || ''
const s3Endpoint = (await get('s3_endpoint')) || ''
const s3AccessKey = (await get('s3_access_key')) || ''
const s3SecretKey = (await get('s3_secret_key')) || ''
const s3BucketName = (await get('s3_bucket_name')) || ''
const s3MemoryKey = (await get('s3_memory_key')) || ''
const s3ConfigKey = (await get('s3_config_key')) || ''

export const usePlugins = create<API>()((setState, getState) => ({
	s3Endpoint,
	s3AccessKey,
	s3SecretKey,
	s3BucketName,
	s3MemoryKey,
	s3ConfigKey,
	setS3ConfigKey: async (key) => {
		setState({ s3ConfigKey: key || '' })
		await set('s3_config_key', key || '')
		return
	},
	setS3MemoryKey: async (key) => {
		setState({ s3MemoryKey: key || '' })
		await set('s3_memory_key', key || '')
		return
	},
	setS3Endpoint: async (endpoint) => {
		setState({ s3Endpoint: endpoint || '' })
		await set('s3_endpoint', endpoint || '')
		return
	},
	setS3AccessKey: async (accessKey) => {
		setState({ s3AccessKey: accessKey || '' })
		await set('s3_access_key', accessKey || '')
		return
	},
	setS3SecretKey: async (secretKey) => {
		setState({ s3SecretKey: secretKey || '' })
		await set('s3_secret_key', secretKey || '')
		return
	},
	setS3BucketName: async (bucketName) => {
		setState({ s3BucketName: bucketName || '' })
		await set('s3_bucket_name', bucketName || '')
		return
	},
	putToS3: async (key, value) => {
		const { s3Endpoint, s3AccessKey, s3SecretKey, s3BucketName } = getState()
		if (!s3Endpoint || !s3AccessKey || !s3SecretKey || !s3BucketName) {
			throw new Error('请先设置 S3 相关凭证')
		}
		const client = new S3Client({
			endpoint: s3Endpoint,
			region: 'auto',
			credentials: {
				accessKeyId: s3AccessKey,
				secretAccessKey: s3SecretKey,
			},
		})
		const command = new PutObjectCommand({
			Bucket: s3BucketName,
			Key: key,
			Body: value,
		})
		await client.send(command)
		return
	},
	getFromS3: async (key) => {
		const { s3Endpoint, s3AccessKey, s3SecretKey, s3BucketName } = getState()
		if (!s3Endpoint || !s3AccessKey || !s3SecretKey || !s3BucketName) {
			throw new Error('请先设置 S3 相关凭证')
		}
		const client = new S3Client({
			endpoint: s3Endpoint,
			region: 'auto',
			credentials: {
				accessKeyId: s3AccessKey,
				secretAccessKey: s3SecretKey,
			},
		})
		const command = new GetObjectCommand({
			Bucket: s3BucketName,
			Key: key,
		})
		const response = await client.send(command)
		const body = await response.Body?.transformToString()
		return body || ''
	},
	qWeatherApiKey,
	testQWeatherApiKey: async () => {
		if (sessionStorage.getItem('qweather_tested') === 'pass') {
			return true
		}
		const { qWeatherApiKey } = getState()
		await getWeather(qWeatherApiKey ?? '')
		sessionStorage.setItem('qweather_tested', 'pass')
		return true
	},
	setQWeatherApiKey: async (apiKey) => {
		setState({ qWeatherApiKey: apiKey || '' })
		await set('qweather_api_key', apiKey || '')
		sessionStorage.removeItem('qweather_tested')
		return
	},
}))

declare type Env = {
  VITE_DEBUG_COMPONENT: boolean
}

declare type ShortTermMemory = {
  role: string
  content: string
  timestamp: number
  tool_calls?: import('openai/resources/index.mjs').ChatCompletionMessageToolCall[] // 出现于模型调用 (role === 'assistant')
  tool_call_id?: string // 出现于模型调用结果 (role === 'tool')
  recall?: { uuid: string; similarity: number; desc: string }[] // 出现于模型调用结果 (role === 'tool')
}

declare type LongTermMemory = {
  uuid: string
  startTime: number
  endTime: number
  title: string
  summary: string
  vector?: number[]
}

declare type ArchivedMemory = {
  belongTo: string // uuid in long term memory
} & ShortTermMemory

declare type ConfigKeys =
  | 'default_live2d'
  | 'live2d_position_y'
  | 'live2d_position_x'
  | 'default_speak_api'
  | 'default_listen_api'
  | 'last_used_token'
  | 'model_max_tokens'
  | 'background_image'
  | 'qweather_api_key'
  | 'f5_tts_endpoint'
  | 'fish_speech_endpoint'
  | 'openai_api_key'
  | 'openai_endpoint'
  | 'openai_model_name'
  | 's3_endpoint'
  | 's3_access_key'
  | 's3_secret_key'
  | 's3_bucket_name'
  | 'is_full_screen'
  | 's3_memory_key'
  | 's3_config_key'
  | 'audios_cache'
  | 'think_cache'
  | 'jina_endpoint'
  | 'jina_api_key'
  | 'vector_dimension'

declare type MemoryKeys =
  | 'self_name'
  | 'user_name'
  | 'short_term_memory'
  | 'long_term_memory'
  | 'archived_memory'
  | 'memory_about_self'
  | 'memory_about_user'
  | 'current_summary'

declare type StoreKeys = ConfigKeys | MemoryKeys

declare type Plugins = {
  qWeatherApiKey?: string
  s3Endpoint?: string
  s3AccessKey?: string
  s3SecretKey?: string
  s3BucketName?: string
  s3MemoryKey?: string
  s3ConfigKey?: string
}

declare type ChatApi = import('openai').OpenAI
declare type ChatApiTest = () => Promise<boolean>

declare type Live2dApi = import('l2d').L2D
declare type Live2dList = {
  name: string
  load: () => Promise<import('l2d').Model>
}[]

declare type SpeakApiParams = {
  fishSpeechEndpoint: string
  f5TtsEndpoint: string
}
declare type SpeakApi = (text: string) => Promise<{ audio: Uint8Array }>
declare type SpeakApiTest = () => Promise<boolean>
declare type LoadSpeakApi = (params: SpeakApiParams) => {
  api: SpeakApi
  test: SpeakApiTest
}
declare type SpeakApiList = (
  | { name: string; api: LoadSpeakApi }
  | { name: string; api: null }
)[]

declare type ListenApiParams = undefined
declare type ListenApi = (callback?: (text: string) => void) => {
  result: Promise<string>
  start: () => void
  stop: () => void
}
declare type ListenApiTest = () => Promise<boolean>
declare type LoadListenApi = (params: ListenApiParams) => {
  api: ListenApi
  test: ListenApiTest
}
declare type ListenApiList = (
  | { name: string; api: LoadListenApi }
  | { name: string; api: null }
)[]

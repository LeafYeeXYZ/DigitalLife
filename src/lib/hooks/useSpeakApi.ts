import { create } from 'zustand'
import { set, get, speakApiList } from '../utils.ts'

type API = {
  speak: SpeakApi | null
  testSpeak: SpeakApiTest | null
  speakApiList: string[]
  currentSpeakApi: string
  setSpeakApi: (name: string) => Promise<void>

  audiosCache: { timestamp: number; audio: Uint8Array }[]
  setAudiosCache: (
    value: { timestamp: number; audio: Uint8Array }[],
  ) => Promise<void>
  addAudioCache: (value: {
    timestamp: number
    audio: Uint8Array
  }) => Promise<void>

  fishSpeechEndpoint: string
  setFishSpeechEndpoint: (endpoint?: string) => Promise<void>
  f5TtsEndpoint: string
  setF5TtsEndpoint: (endpoint?: string) => Promise<void>
}

const DEFAULT_FISH_SPEECH_ENDPOINT = 'http://127.0.0.1:8080'
const DEFAULT_F5_TTS_ENDPOINT = 'http://127.0.0.1:5010/api'

const localSpeakApi = await get('default_speak_api')
const localFishSpeechEndpoint =
  (await get('fish_speech_endpoint')) ?? DEFAULT_FISH_SPEECH_ENDPOINT
const localF5TtsEndpoint =
  (await get('f5_tts_endpoint')) ?? DEFAULT_F5_TTS_ENDPOINT
const localAudiosCache = (await get('audios_cache')) ?? []

const defaultLoad =
  speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
const defaultApi =
  defaultLoad.api &&
  defaultLoad.api({
    fishSpeechEndpoint: localFishSpeechEndpoint,
    f5TtsEndpoint: localF5TtsEndpoint,
  })

export const useSpeakApi = create<API>()((setState, getState) => ({
  audiosCache: localAudiosCache,
  setAudiosCache: async (value) => {
    setState({ audiosCache: value })
    await set('audios_cache', value)
  },
  addAudioCache: async (value) => {
    const { audiosCache } = getState()
    const newCache = [value, ...audiosCache]
    setState({ audiosCache: newCache })
    await set('audios_cache', newCache)
  },
  speak: defaultApi && defaultApi.api,
  testSpeak: defaultApi && defaultApi.test,
  speakApiList: speakApiList.map(({ name }) => name),
  currentSpeakApi: defaultLoad.name,
  setSpeakApi: async (name) => {
    const item = speakApiList.find((api) => api.name === name)
    if (item) {
      const { fishSpeechEndpoint, f5TtsEndpoint } = getState()
      const api = item.api && item.api({ fishSpeechEndpoint, f5TtsEndpoint })
      setState({
        currentSpeakApi: name,
        speak: api && api.api,
        testSpeak: api && api.test,
      })
      await set('default_speak_api', name)
    }
    return
  },
  fishSpeechEndpoint: localFishSpeechEndpoint,
  setFishSpeechEndpoint: async (endpoint) => {
    const { f5TtsEndpoint, currentSpeakApi } = getState()
    const v = endpoint || DEFAULT_FISH_SPEECH_ENDPOINT
    const item = speakApiList.find((api) => api.name === currentSpeakApi)!
    const api = item.api && item.api({ fishSpeechEndpoint: v, f5TtsEndpoint })
    setState({
      fishSpeechEndpoint: v,
      speak: api && api.api,
      testSpeak: api && api.test,
    })
    await set('fish_speech_endpoint', v)
    sessionStorage.removeItem('fish_speech_test')
  },
  f5TtsEndpoint: localF5TtsEndpoint,
  setF5TtsEndpoint: async (endpoint) => {
    const { fishSpeechEndpoint, currentSpeakApi } = getState()
    const v = endpoint || DEFAULT_F5_TTS_ENDPOINT
    const item = speakApiList.find((api) => api.name === currentSpeakApi)!
    const api = item.api && item.api({ fishSpeechEndpoint, f5TtsEndpoint: v })
    setState({
      f5TtsEndpoint: v,
      speak: api && api.api,
      testSpeak: api && api.test,
    })
    await set('f5_tts_endpoint', v)
    sessionStorage.removeItem('f5_tts_test')
  },
}))

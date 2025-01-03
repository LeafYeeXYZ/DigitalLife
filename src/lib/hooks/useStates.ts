import { create } from 'zustand'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ReactNode } from 'react'
import { get, set as _set } from '../utils.ts'

const DAFAULT_BACKGROUND = '/back.png'
const background = await get('background_image') || DAFAULT_BACKGROUND
const qWeatherApiKey = await get('qweather_api_key') || ''

type GlobalState = {
  disabled: false | string | ReactNode
  setDisabled: (disabled: false | string | ReactNode) => void
  messageApi: MessageInstance | null
  setMessageApi: (messageApi: MessageInstance | null) => void
  background: string
  setBackground: (background?: string) => Promise<void>
  qWeatherApiKey: string
  setQWeatherApiKey: (apiKey: string) => Promise<void>
  chatMode: 'text' | 'voice' | 'none' | 'error'
  setChatMode: (mode: 'text' | 'voice' | 'none' | 'error') => void
}

export const useStates = create<GlobalState>()((set) => ({
  disabled: true,
  setDisabled: (disabled) => set({ disabled }),
  messageApi: null,
  setMessageApi: (messageApi) => set({ messageApi }),
  background,
  setBackground: async (background) => {
    set({ background: background || DAFAULT_BACKGROUND })
    await _set('background_image', background || DAFAULT_BACKGROUND)
  },
  qWeatherApiKey,
  setQWeatherApiKey: async (apiKey) => {
    set({ qWeatherApiKey: apiKey })
    await _set('qweather_api_key', apiKey || '')
  },
  chatMode: 'none',
  setChatMode: (mode) => set({ chatMode: mode }),
}))

import { create } from 'zustand'
import { set, get, live2dList } from '../utils.ts'
import type { Model } from 'l2d'

type API = {
  live2d: Model | null
  live2dList: string[]
  live2dName: string

  live2dOpen: boolean
  setLive2dOpen: (open: boolean) => Promise<void>
  _loadLive2d: () => Promise<Model>
  setLoadLive2d: (name: string) => Promise<void>

  live2dPositionX: number
  setLive2dPositionX: (position: number) => void
  live2dPositionY: number
  setLive2dPositionY: (position: number) => void

  showTips: () => void
  hideTips: (inSeconds?: number) => void
  setTips: (tips: string) => void

  background: string
  setBackground: (background?: string) => Promise<void>

  isFullScreen: boolean
  setIsFullScreen: (isFullScreen: boolean) => Promise<void>
}

const DAFAULT_BACKGROUND = '/back.png'

const background = (await get('background_image')) || DAFAULT_BACKGROUND
const localLive2d = await get('default_live2d')
const defaultLive2d =
  live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]
const localIsFullScreen = (await get('is_full_screen')) === 'true'
const localLive2dPositionY = await get('live2d_position_y')
const defaultLive2dPositionY = localLive2dPositionY
  ? parseInt(localLive2dPositionY)
  : 0
const localLive2dPositionX = await get('live2d_position_x')
const defaultLive2dPositionX = localLive2dPositionX
  ? parseInt(localLive2dPositionX)
  : 0

export const useLive2dApi = create<API>()((setState, getState) => ({
  live2d: null,
  live2dList: live2dList.map(({ name }) => name),
  live2dName: defaultLive2d.name,
  live2dOpen: false,
  setLive2dOpen: async (open) => {
    if (open) {
      const { _loadLive2d } = getState()
      const model = await _loadLive2d()
      setState({ live2dOpen: true, live2d: model })
    } else {
      const { live2d } = getState()
      live2d && live2d.destroy()
      setState({ live2dOpen: false, live2d: null })
    }
    return
  },
  _loadLive2d: defaultLive2d.load,
  setLoadLive2d: async (name) => {
    const { live2dOpen, live2d } = getState()
    const item = live2dList.find((api) => api.name === name)
    if (!item) {
      throw new Error('Live2d model not found')
    }
    live2d && live2d.destroy()
    await set('default_live2d', name)
    if (live2dOpen) {
      const model = await item.load()
      setState({ _loadLive2d: item.load, live2dName: name, live2d: model })
    } else {
      setState({ _loadLive2d: item.load, live2dName: name })
    }
    return
  },
  live2dPositionY: defaultLive2dPositionY,
  setLive2dPositionY: async (position) => {
    setState({ live2dPositionY: position })
    await set('live2d_position_y', position.toString())
    return
  },
  live2dPositionX: defaultLive2dPositionX,
  setLive2dPositionX: async (position) => {
    setState({ live2dPositionX: position })
    await set('live2d_position_x', position.toString())
    return
  },
  background,
  setBackground: async (background) => {
    setState({ background: background || DAFAULT_BACKGROUND })
    await set('background_image', background || DAFAULT_BACKGROUND)
    return
  },
  isFullScreen: localIsFullScreen,
  setIsFullScreen: async (isFullScreen) => {
    await set('is_full_screen', isFullScreen.toString())
    setState({ isFullScreen })
    return
  },
  showTips: () => {
    const timer = sessionStorage.getItem('hide-live2d-message-timer')
    if (timer) {
      clearTimeout(parseInt(timer))
      sessionStorage.removeItem('hide-live2d-message-timer')
    }
    document.getElementById('live2d-message')!.style.opacity = '0.9'
  },
  hideTips: (inSeconds) => {
    const timer = sessionStorage.getItem('hide-live2d-message-timer')
    if (timer) {
      clearTimeout(parseInt(timer))
      sessionStorage.removeItem('hide-live2d-message-timer')
    }
    if (inSeconds) {
      const timer = setTimeout(() => {
        document.getElementById('live2d-message')!.style.opacity = '0'
      }, inSeconds * 1000)
      sessionStorage.setItem('hide-live2d-message-timer', timer.toString())
    } else {
      document.getElementById('live2d-message')!.style.opacity = '0'
    }
  },
  setTips: (tips) => {
    document.getElementById('live2d-message')!.innerText = tips
  },
}))

export { speakApiList } from './api/shared/api.speak.ts'
export { listenApiList } from './api/shared/api.listen.ts'
export { live2dList } from './api/shared/api.live2d.ts'
export { set, get, save } from './api/web/api.store.ts'
export { openLink } from './api/web/api.utils.ts'

export async function getWeather(apiKey: string): Promise<string> {
  try {
    const { promise, resolve, reject } = Promise.withResolvers<GeolocationPosition>()
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve(position)
      }, error => {
        reject(error)
      }
    )
    const position = await promise
    const { latitude, longitude } = position.coords
    const response = await fetch(`https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=${apiKey}`)
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    const w = data.now
    return `当前温度: ${w.temp}摄氏度, 体感温度: ${w.feelsLike}摄氏度, 天气: ${w.text}, 风向: ${w.windDir}, 风速: ${w.windSpeed}公里/小时, 湿度: ${w.humidity}%, 过去一小时降水量: ${w.precip}毫米, 能见度: ${w.vis}公里`
  } catch (error) {
    throw new Error(`获取天气信息失败: ${error instanceof Error ? error.message : error}`)
  }
}

/**
 * 获取时间: XXXX年X月X日X时X分X秒
 * @param timestamp 时间戳, 默认为当前时间
 * @returns 时间字符串
 */
export function getTime(timestamp?: number) {
  const date = new Date(timestamp ?? Date.now())
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`
}

/**
 * 获取日期: XXXX年X月X日
 * @param timestamp 时间戳, 默认为当前时间
 * @returns 日期字符串
 */
export function getDate(timestamp?: number) {
  const date = new Date(timestamp ?? Date.now())
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
  return btoa(binary)
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

import { create } from 'zustand'
import { set, get, listenApiList } from '../utils.ts'

type API = {
  listen: ListenApi | null
  testListen: ListenApiTest | null
  listenApiList: string[]
  currentListenApi: string
  setListenApi: (name: string) => Promise<void>
}

const localListenApi = await get('default_listen_api')
const defaultLoad =
  listenApiList.find(({ name }) => name === localListenApi) ?? listenApiList[0]
const defaultApi = defaultLoad.api && defaultLoad.api(undefined)

export const useListenApi = create<API>()((setState) => ({
  listen: defaultApi && defaultApi.api,
  testListen: defaultApi && defaultApi.test,
  listenApiList: listenApiList.map(({ name }) => name),
  currentListenApi: defaultLoad.name,
  setListenApi: async (name) => {
    const item = listenApiList.find((api) => api.name === name)
    if (item) {
      const api = item.api && item.api(undefined)
      setState({
        currentListenApi: name,
        listen: api && api.api,
        testListen: api && api.test,
      })
      await set('default_listen_api', name)
    }
    return
  },
}))

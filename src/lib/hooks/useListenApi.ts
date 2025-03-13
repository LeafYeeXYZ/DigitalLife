import { create } from 'zustand'
import { get, listenApiList, set } from '../utils.ts'

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
const defaultApi = defaultLoad.api?.(undefined)

export const useListenApi = create<API>()((setState) => ({
	listen: defaultApi?.api || null,
	testListen: defaultApi?.test || null,
	listenApiList: listenApiList.map(({ name }) => name),
	currentListenApi: defaultLoad.name,
	setListenApi: async (name) => {
		const item = listenApiList.find((api) => api.name === name)
		if (item) {
			const api = item.api?.(undefined)
			setState({
				currentListenApi: name,
				listen: api?.api || null,
				testListen: api?.test || null,
			})
			await set('default_listen_api', name)
		}
		return
	},
}))

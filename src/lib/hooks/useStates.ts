import type { MessageInstance } from 'antd/es/message/interface'
import type { ReactNode } from 'react'
import { create } from 'zustand'

type GlobalState = {
	disabled: false | string | ReactNode
	setDisabled: (disabled: false | string | ReactNode) => void
	forceAllowNav: boolean
	setForceAllowNav: (forceAllowNav: boolean) => void
	messageApi: MessageInstance | null
	setMessageApi: (messageApi: MessageInstance | null) => void
}

export const useStates = create<GlobalState>()((setState) => ({
	disabled: true,
	setDisabled: (disabled) => setState({ disabled }),
	messageApi: null,
	setMessageApi: (messageApi) => setState({ messageApi }),
	forceAllowNav: false,
	setForceAllowNav: (forceAllowNav) => setState({ forceAllowNav }),
}))

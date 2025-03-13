import { useSyncExternalStore } from 'react'

export function useIsMobile() {
	return useSyncExternalStore(subscribe, getSnapshot)
}

function subscribe(callback: () => void) {
	window.addEventListener('resize', callback)
	return () => window.removeEventListener('resize', callback)
}

function getSnapshot() {
	return window.innerWidth < 800
}

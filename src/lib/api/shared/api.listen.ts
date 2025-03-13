const SpeechRecognition =
	// @ts-expect-error TS 无法识别 Web Speech API
	window.SpeechRecognition || window.webkitSpeechRecognition

const listen_browser: ListenApi = (callback) => {
	const recognition = new SpeechRecognition()
	recognition.lang = 'zh-CN'
	recognition.interimResults = true
	recognition.continuous = true
	const { promise, resolve, reject } = Promise.withResolvers<string>()
	let text = ''
	// @ts-expect-error TS 无法识别 Web Speech API
	recognition.onresult = (event) => {
		text = ''
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			text += event.results[i][0].transcript
		}
		typeof callback === 'function' && callback(text)
	}
	recognition.onend = () => {
		resolve(text)
	}
	// @ts-expect-error TS 无法识别 Web Speech API
	recognition.onerror = (event) => {
		reject(event?.message ?? event?.error ?? event)
	}
	return {
		result: promise,
		start: () => recognition.start(),
		stop: () => recognition.stop(),
	}
}
const test_browser: ListenApiTest = async () => {
	try {
		if (!SpeechRecognition) {
			throw new Error('Web Speech API 不可用')
		}
		if (sessionStorage.getItem('microphone_tested') === 'pass') {
			return true
		}
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		for (const track of stream.getTracks()) {
			track.stop()
		}
		sessionStorage.setItem('microphone_tested', 'pass')
		return true
	} catch (e) {
		throw new Error(`语音识别测试失败: ${e instanceof Error ? e.message : e}`)
	}
}

export const listenApiList: ListenApiList = [
	{ name: '关闭', api: null },
	{
		name: 'Web Speech API',
		api: () => ({ api: listen_browser, test: test_browser }),
	},
]

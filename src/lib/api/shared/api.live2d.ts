import { init } from 'l2d'

const live2d = init(document.getElementById('live2d') as HTMLCanvasElement)

const rabbitBoy = async () => {
	const model = await live2d.create({
		path: '/live2d/rabbit-boy/兔兔【新.model3.json',
		scale: 0.18,
		// motionSync: '/live2d/example.motionsync.json'
		// 语音同步嘴形, 需要配合修改 <MessageBox /> / <ChatText /> / <ChatVoice /> 组件, 未来版本可能会支持
		// <MessageBox /> 的使用示例:
		// onClick={async () => {
		//   const audioBuffer = await (new AudioContext().decodeAudioData(audio!.buffer))
		//   live2d?.speak(audioBuffer)
		// }}
	})
	return model
}

const dogBoyA = async () => {
	const model = await live2d.create({
		path: '/live2d/dog-boy-a/鱼香天天卷版权所有XIAOPmaiddress.model3.json',
		scale: 0.13,
	})
	return model
}

const dogBoyB = async () => {
	const model = await live2d.create({
		path: '/live2d/dog-boy-b/鱼香天天卷版权所有守护灵小狗初始版.model3.json',
		scale: 0.15,
	})
	return model
}

const evilBoy = async () => {
	const model = await live2d.create({
		path: '/live2d/evil-boy/no4.新（基础）.model3.json',
		scale: 0.11,
	})
	return model
}

const darkBoy = async () => {
	const model = await live2d.create({
		path: '/live2d/dark-boy/紫汐.model3.json',
		scale: 0.09,
	})
	return model
}

const jiniqi = async () => {
	const model = await live2d.create({
		path: '/live2d/jiniqi/基尼奇.model3.json',
		scale: 0.08,
	})
	return model
}

const heroBoy = async () => {
	const model = await live2d.create({
		path: '/live2d/hero-boy/live1.model3.json',
		scale: 0.09,
	})
	return model
}

export const live2dList: Live2dList = [
	{ name: '兔兔{name}', load: rabbitBoy },
	{ name: '狗狗{name} (日常版)', load: dogBoyB },
	{ name: '狗狗{name} (女仆版)', load: dogBoyA },
	{ name: '恶魔{name}', load: evilBoy },
	{ name: '紫色{name}', load: darkBoy },
	{ name: '勇者{name}', load: heroBoy },
	{ name: '基尼奇', load: jiniqi },
]

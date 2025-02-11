import { init } from 'l2d'

export const live2d = init(document.getElementById('live2d')!)

const rabbitBoy = async () => {
  await live2d.loadModel({
    path: '/live2d/rabbit-boy/兔兔【新.model3.json',
    scale: 0.18,
  })
  return
}

const evilBoy = async () => {
  await live2d.loadModel({
    path: '/live2d/evil-boy/no4.新（基础）.model3.json',
    scale: 0.11,
  })
  return
}

const darkBoy = async () => {
  await live2d.loadModel({
    path: '/live2d/dark-boy/紫汐.model3.json',
    scale: 0.09,
  })
  return
}

const jiniqi = async () => {
  await live2d.loadModel({
    path: '/live2d/jiniqi/基尼奇.model3.json',
    scale: 0.08,
  })
  return
}

const heroBoy = async () => {
  await live2d.loadModel({
    path: '/live2d/hero-boy/live1.model3.json',
    scale: 0.09,
  })
  return
}

export const live2dList: Live2dList = [
  { name: '恶魔小叶子', load: evilBoy },
  { name: '兔兔小叶子', load: rabbitBoy },
  { name: '紫色小叶子', load: darkBoy },
  { name: '勇者小叶子', load: heroBoy },
  { name: '基尼奇', load: jiniqi },
]

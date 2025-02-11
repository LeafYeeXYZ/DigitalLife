import { init } from 'l2d'

// 1. 要是实例原生有个 destroy 方法就好了, 现在需要手动移除元素
// 2. 模型没能定位到 parentElement 上, 且只能也在左下或右下
// 3. 说话时没有张嘴动画 (引申来说, 希望添加一个运行模型动画的实例方法)

const rabbitBoy: LoadLive2d = async (element) => {
  const live2d = init(element)
  await live2d.loadModel({
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
      style: { minWidth: '200px' },
    },
    stageStyle: { width: '280px' },
    models: [{
      path: '/live2d/rabbit-boy/兔兔【新.model3.json',
      scale: 0.18,
      position: [0, 70],
    }],
  })
  return live2d
}

const evilBoy: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
    },
    models: [{
      path: '/live2d/evil-boy/no4.新（基础）.model3.json',
      scale: 0.11,
      position: [0, 70],
    }],
  })
  return live2d
}

const goldBoy: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
    },
    models: [{
      path: '/live2d/gold-boy/71全身无按键.model3.json',
      scale: 0.13,
      position: [0, 70],
    }],
  })
  return live2d
}

const darkBoy: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
      style: { minWidth: '200px' },
    },
    models: [{
      path: '/live2d/dark-boy/紫汐.model3.json',
      scale: 0.09,
      position: [0, 70],
    }],
  })
  return live2d
}

const jiniqi: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
    },
    models: [{
      path: '/live2d/jiniqi/基尼奇.model3.json',
      scale: 0.08,
      position: [0, 70],
    }],
  })
  return live2d
}

const heroBoy: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
      style: { minWidth: '200px' },
    },
    models: [{
      path: '/live2d/hero-boy/live1.model3.json',
      scale: 0.09,
      position: [0, 70],
    }],
  })
  return live2d
}

export const live2dList: Live2dList = [
  { name: '恶魔小叶子', api: evilBoy },
  { name: '兔兔小叶子', api: rabbitBoy },
  { name: '紫色小叶子', api: darkBoy },
  { name: '金毛小叶子', api: goldBoy },
  { name: '勇者小叶子', api: heroBoy },
  { name: '基尼奇', api: jiniqi },
]

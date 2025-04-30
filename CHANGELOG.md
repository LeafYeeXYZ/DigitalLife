# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.0.0](https://github.com/LeafYeeXYZ/DigitalLife/compare/v1.4.1...v2.0.0) (2025-04-30)


### ⚠ BREAKING CHANGES

* 重构记忆架构

### Features

* 模型的显示名称将和数字生命名字匹配 ([9b24be2](https://github.com/LeafYeeXYZ/DigitalLife/commit/9b24be258614b667617a4e7aebd1456b940b9dcd))
* 实现自定义的 live2d 模型对话框 ([f0bebc9](https://github.com/LeafYeeXYZ/DigitalLife/commit/f0bebc919997869bf1100cb57fc3f012416817ee))
* 使用 biome 代替 prettier 和 eslint 并新增数项运行时类型检查 ([cf07b7c](https://github.com/LeafYeeXYZ/DigitalLife/commit/cf07b7c0c1edcc41eeb634841e72eb47ac3457a7))
* 现在可以删除指定长时记忆 ([69db82b](https://github.com/LeafYeeXYZ/DigitalLife/commit/69db82bef3da15be74f509314f30e23c06e7fed8))
* 新增两个 live2d 模型 ([56c64bc](https://github.com/LeafYeeXYZ/DigitalLife/commit/56c64bc7ae25ed781f22311a8bb2cba1c2f28c12))
* 优化 Live2d 加载逻辑并新增欢迎消息 ([94be79f](https://github.com/LeafYeeXYZ/DigitalLife/commit/94be79f757f53890858ddde3462a5bb423780762))
* 支持自定义模型位置 ([23c5c34](https://github.com/LeafYeeXYZ/DigitalLife/commit/23c5c34b27cdd1e630d7f91a2453a7769df92750))


### Bug Fixes

* 修复模型未清理的问题 ([0e70178](https://github.com/LeafYeeXYZ/DigitalLife/commit/0e70178e35f8a7ff37a980f84015de098cb3393f))
* 修复消息框遮挡问题 ([cf5ede7](https://github.com/LeafYeeXYZ/DigitalLife/commit/cf5ede7f520b89423cafe682ff9bfa465cd675c2))
* 修复一个错误的调用 ([b0ffc48](https://github.com/LeafYeeXYZ/DigitalLife/commit/b0ffc489d3c459bc5fa8d68701805ec7143013ed))


### Refactoring

* 不再检查模型ID ([84c898f](https://github.com/LeafYeeXYZ/DigitalLife/commit/84c898f3b1aed733bd2904d57b4bb23f687d045a))
* 从 og-my-live2d 迁移到 l2d ([61266cd](https://github.com/LeafYeeXYZ/DigitalLife/commit/61266cd0eb8c629e4230ddf4c011c8a9246ee5b4))
* 重构记忆架构 ([2d3b908](https://github.com/LeafYeeXYZ/DigitalLife/commit/2d3b90821bf1d139b384b0661eacb57889e097d4))


### Improvements

* 优化 live2d 对话框的标点显示 ([72be1e4](https://github.com/LeafYeeXYZ/DigitalLife/commit/72be1e4f0a13adb121f6f5fae535b66edb70ac07))
* 优化部分确认弹窗描述 ([cb2c058](https://github.com/LeafYeeXYZ/DigitalLife/commit/cb2c0582c7288327cbabfb78aa21958163658a04))
* 优化调试组件 ([e6e24cf](https://github.com/LeafYeeXYZ/DigitalLife/commit/e6e24cfd3b122e9bd5e95260e404442878045d0f))
* 优化全局状态使用, 减少重新渲染 ([9a2d5cc](https://github.com/LeafYeeXYZ/DigitalLife/commit/9a2d5ccf32955f94612e8c95a954fe8859b89ac5))

## [1.4.1](https://github.com/LeafYeeXYZ/DigitalLife/compare/v1.4.0...v1.4.1) (2025-02-11)

### Features

- 支持 DeepSeek R1 等推理模型 ([f1c2086](https://github.com/LeafYeeXYZ/DigitalLife/commit/f1c2086f14f8dc6dfc021fcff8c6d43dbda7af68))

### Bug Fixes

- 修复 DeepSeek 模型解析和请求的问题 ([2133b13](https://github.com/LeafYeeXYZ/DigitalLife/commit/2133b138d78fb1e5a98bf564ce534964e12fdf56))

### Improvements

- 继续优化记忆模型架构和效果 ([2d13c9f](https://github.com/LeafYeeXYZ/DigitalLife/commit/2d13c9f871c6ad358bc944fcb0e3433d295e73cf))
- 优化上下文长度衰减逻辑 ([74dba77](https://github.com/LeafYeeXYZ/DigitalLife/commit/74dba772c3fc93fab92595187c6615bd0f395f6a))
- 优化上下文长度衰减逻辑 ([680c4a9](https://github.com/LeafYeeXYZ/DigitalLife/commit/680c4a9e4112d8a295ec102ce339fdd2f5c0bf7c))
- 优化一些样式细节 ([f980db1](https://github.com/LeafYeeXYZ/DigitalLife/commit/f980db1e9487c6ad930af3fda8ef019d338048e5))

## [1.4.0](https://github.com/LeafYeeXYZ/DigitalLife/compare/v1.3.0...v1.4.0) (2025-01-23)

### Features

- 根据记忆压力动态调整输入给模型的历史消息长度 ([f1a4b21](https://github.com/LeafYeeXYZ/DigitalLife/commit/f1a4b213419268f9db2008ba1d4fa91658922524))
- 支持配置密钥等信息的云备份 ([0d24cdd](https://github.com/LeafYeeXYZ/DigitalLife/commit/0d24cdd69357b8ed3d76ce8ab4c953d133ea847a))

### Bug Fixes

- 解决模型可能会连续回忆的问题 ([36b70bd](https://github.com/LeafYeeXYZ/DigitalLife/commit/36b70bd52af477b93f7405d8f8c05b9f1e613c83))

### Refactoring

- 改用函数调用来提取记忆, 将生成回复和更新总结拆分为两次 ([c8c0b7c](https://github.com/LeafYeeXYZ/DigitalLife/commit/c8c0b7c7c63f0af09b5f81cc47d42fe59ab1d3df))
- 更新记忆使用对话内总结, 大幅缩减 Token 量 ([236cd42](https://github.com/LeafYeeXYZ/DigitalLife/commit/236cd42f2fdbe4d6f2911dd8b65f0f592d14b171))
- 优化记忆模型, 提升小模型的推理表现 ([1b40656](https://github.com/LeafYeeXYZ/DigitalLife/commit/1b406563ac0b55fcc0cf0b6c92e17fdba6d72d59))

### Improvements

- 将云备份设置和记忆云存储分离 ([3c18d04](https://github.com/LeafYeeXYZ/DigitalLife/commit/3c18d04fcfba5a829029a9a1407aa749fff7d979))
- 优化笨笨小模型的记忆提取效果 ([3bd9f7b](https://github.com/LeafYeeXYZ/DigitalLife/commit/3bd9f7bd5fb00ac70e9ab79e1e48530c4494820d))
- 优化记忆提取 ([97cf3ec](https://github.com/LeafYeeXYZ/DigitalLife/commit/97cf3ec1e221d716051cfa693ae09ab22dd2e474))
- 优化记忆消息的展示效果 ([57495ea](https://github.com/LeafYeeXYZ/DigitalLife/commit/57495ea4d5bde5fceeee7eea47868d81540f46f7))
- 优化提示词, 提升对话和总结效果 ([195d72b](https://github.com/LeafYeeXYZ/DigitalLife/commit/195d72b3496659df9ca3948ef6acc60527cc7e11))

## [1.3.0](https://github.com/LeafYeeXYZ/DigitalLife/compare/v1.2.0...v1.3.0) (2025-01-14)

### Features

- 记忆提取功能初步完成 ([46931e9](https://github.com/LeafYeeXYZ/DigitalLife/commit/46931e9286ef4dc262f15cf4391d873d8dad702e))
- 提取记忆的过程中提早给用户反馈 ([c3df40d](https://github.com/LeafYeeXYZ/DigitalLife/commit/c3df40d240656e65f6751299a7bf9c3d49ada6c6))
- 长时记忆向量化 ([0a98664](https://github.com/LeafYeeXYZ/DigitalLife/commit/0a986645038414edb5dba5a5d6315583485c9c65))

### Bug Fixes

- 修复不正确的组件禁用 ([4dba3f2](https://github.com/LeafYeeXYZ/DigitalLife/commit/4dba3f2310771002698fcfdfa7b3d4c2fc9d011a))
- 修复了潜在的向量维度不匹配问题 ([97b145a](https://github.com/LeafYeeXYZ/DigitalLife/commit/97b145af05adc8e8193e22aafc88a4056bfee399))
- 修复中途更新的记忆缺少属性的问题 ([4e80f3d](https://github.com/LeafYeeXYZ/DigitalLife/commit/4e80f3dfb223c8117f72f3d1aff9c6f17a2bc6dd))

### Refactoring

- 合并生成回复和更新总结为一次模型调用 ([4a878b3](https://github.com/LeafYeeXYZ/DigitalLife/commit/4a878b37c47c41a596695478a6af35a09ab8efa4))

### Improvements

- 记忆提取的数量改为固定的两条 ([519b19e](https://github.com/LeafYeeXYZ/DigitalLife/commit/519b19eccd1d212109475ae296459666c8bdc2b6))
- 排除记忆提取过程中的重复记忆 ([011a64a](https://github.com/LeafYeeXYZ/DigitalLife/commit/011a64a5c9fb604cb5087c1a5ce4a6b95211d914))
- 天气信息现在会缓存半个小时 ([726e1da](https://github.com/LeafYeeXYZ/DigitalLife/commit/726e1da269a9c2016cd1fc6ec54bf44689016b3f))
- 现在文字对话语音生成结束将即时更新 ([61a9fa1](https://github.com/LeafYeeXYZ/DigitalLife/commit/61a9fa19e17dab6a4e2600f51dac337b512cadd8))
- 优化关于自主回忆的提示词 ([ac8d2aa](https://github.com/LeafYeeXYZ/DigitalLife/commit/ac8d2aa241804b311b447a3815d408a73ce6a23a))
- 优化记忆提取的提示词 ([a6c1cf8](https://github.com/LeafYeeXYZ/DigitalLife/commit/a6c1cf8cfe78a126293ecddc53d494616d44630b))
- 优化记忆提取重复时发送给模型的提示词 ([16a4756](https://github.com/LeafYeeXYZ/DigitalLife/commit/16a475694fb1d21d050acb4d00c9b8cfcedc3db9))
- 优化语音识别 API 的测试流程 ([351f245](https://github.com/LeafYeeXYZ/DigitalLife/commit/351f24579ec404ec8ec88c0c3650fa9046638c9a))
- 在提取记忆的提示中隐藏底部工具栏 ([0afa1ab](https://github.com/LeafYeeXYZ/DigitalLife/commit/0afa1ab68f9bb625ce47b8db47a01fbd6a136d63))

## [1.2.0](https://github.com/LeafYeeXYZ/DigitalLife/compare/v1.1.0...v1.2.0) (2025-01-08)

### Features

- 对话上下文中包含与用户首次相遇的时间 ([40223be](https://github.com/LeafYeeXYZ/DigitalLife/commit/40223bef02bcdd769352f679bc6fdae987a8e446))
- 记忆总结和更新中可以获取真实世界信息 ([a8321fd](https://github.com/LeafYeeXYZ/DigitalLife/commit/a8321fd7eae56c19c3556b623f7423db9d9987fe))
- 上传和下载记忆时新增确认步骤 ([f74ce88](https://github.com/LeafYeeXYZ/DigitalLife/commit/f74ce88de52341872f0b6e55f87f4860525f5628))
- 时间信息现在包括星期几 ([eb7d7ea](https://github.com/LeafYeeXYZ/DigitalLife/commit/eb7d7eaa5f6acd55fc9b968e020fa7c9bb3b734f))
- 添加测试音频以减少 Safari 中可能出现的拒绝播放音频问题 ([39ee8fd](https://github.com/LeafYeeXYZ/DigitalLife/commit/39ee8fda598dbce4946883718516664654e1ce56))
- 为云备份按钮添加图标 ([b0651b4](https://github.com/LeafYeeXYZ/DigitalLife/commit/b0651b4cbb5f5dc974322deed8f37468b6f4736b))
- 新增记忆云备份功能 ([6dec7c6](https://github.com/LeafYeeXYZ/DigitalLife/commit/6dec7c6c697767c22529f30a5dc8beabcb7c2cb1))
- 语音现在可以多次播放且新增语音错误提示 ([c0034cc](https://github.com/LeafYeeXYZ/DigitalLife/commit/c0034ccf1a81a573058202e3730aeeb455137fb4))
- 云存储允许自定义存储键 ([34449ca](https://github.com/LeafYeeXYZ/DigitalLife/commit/34449cae606cd4b208607fd372f5798ca960a8c6))
- 允许全屏背景 ([91495d2](https://github.com/LeafYeeXYZ/DigitalLife/commit/91495d29c2a14050adf932d113aae15427367fee))
- 支持使用通用的 S3 服务进行云备份 ([a1bc7aa](https://github.com/LeafYeeXYZ/DigitalLife/commit/a1bc7aaeccfecf3c62f31c094b3376e37c5bdcd4))

### Bug Fixes

- 修复 Safari 浏览器语音对话卡死的问题 ([b91f506](https://github.com/LeafYeeXYZ/DigitalLife/commit/b91f506e6b75faed3c7528f93ea38949a972f76d))
- 修复 Safari 浏览器语音对话卡死的问题 ([26c5681](https://github.com/LeafYeeXYZ/DigitalLife/commit/26c56819d263942ac0a27fd4b2f455cabf63938a))
- 修复按钮未正确变色的问题 ([2dc80e8](https://github.com/LeafYeeXYZ/DigitalLife/commit/2dc80e88da7756af8e41f82bc8a8f2dc6bfb90de))
- 修复记忆更新时, 短时记忆缓存未清除的问题 ([5d6920a](https://github.com/LeafYeeXYZ/DigitalLife/commit/5d6920a09fb79113dadd52be2fe59ad387964196))
- 修复聊天界面输入框遮挡问题 ([1d9306c](https://github.com/LeafYeeXYZ/DigitalLife/commit/1d9306c4f4f68cad306f743f91aef3157e034d8a))
- 修复移动端屏幕过窄时的显示异常 ([20bfe96](https://github.com/LeafYeeXYZ/DigitalLife/commit/20bfe96569d206977cfc99a77220fcaf5c46c80e))

### Refactoring

- 全面重构提示词, 并优化 Tokens 统计 ([79f2c78](https://github.com/LeafYeeXYZ/DigitalLife/commit/79f2c78790fb6ac5871c8b77c0aceb35faf23645))
- 重构包括天气在内的外部信息加载方式 ([09a494c](https://github.com/LeafYeeXYZ/DigitalLife/commit/09a494c1595777123f489e349ad9f084f6426fd1))

### Improvements

- 添加语音播放的浏览器兼容提示 ([f706fa5](https://github.com/LeafYeeXYZ/DigitalLife/commit/f706fa506068ac3e6473977e13621deaba54293f))
- 优化 UI 的滚动布局 ([182327a](https://github.com/LeafYeeXYZ/DigitalLife/commit/182327a98cc403571879e2347ac1de61a9570938))
- 优化代码分块, 减少网页加载时间 ([b32af58](https://github.com/LeafYeeXYZ/DigitalLife/commit/b32af58f3e47197ebc1ac0e9bc9eddb82b505b64))
- 优化更新记忆时的提示词 ([3ebe05f](https://github.com/LeafYeeXYZ/DigitalLife/commit/3ebe05fc1ec231fac3081dfb5d6998217f0f0c8a))
- 优化记忆更新参数验证方式 ([e2b1009](https://github.com/LeafYeeXYZ/DigitalLife/commit/e2b10099e0e281640032911547ed71e734384ebe))
- 优化语音对话的识别延时 ([e8bf29e](https://github.com/LeafYeeXYZ/DigitalLife/commit/e8bf29e88bc8e2a75a17a4cb1221fe2f8eeab28c))
- 优化在 IOS 端 Safari 浏览器的背景颜色 ([9583b26](https://github.com/LeafYeeXYZ/DigitalLife/commit/9583b260a571e1db8c37b4c51da7b488dedfca84))
- 在没有记忆时自动聚焦输入框 ([23d7a7b](https://github.com/LeafYeeXYZ/DigitalLife/commit/23d7a7beaa7a54072d9835b9b8ba39cc22a6b3c9))

## [1.1.0](https://github.com/LeafYeeXYZ/CyberLeaf/compare/v1.0.0...v1.1.0) (2025-01-06)

### Features

- 现在可以一键将特定设置恢复为默认值 ([4982bc9](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4982bc974f9f2807c1f7c760c2d3e7bfc0b2c16e))
- 支持调整窗口相对大小 ([3fce95d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3fce95d3ec9672dcbf950f3db69cfd8c51f7e1a5))
- 支持手机等小屏幕设备使用 ([78a2109](https://github.com/LeafYeeXYZ/CyberLeaf/commit/78a2109e702265dd8b64109aa3f49ec921f350c2))

### Bug Fixes

- 修复了修改 TTS 地址时未清除测试缓存的潜在问题 ([e15dbaa](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e15dbaaf84b8c0f233d8d5db4f4c781c8c15b7da))

### Refactoring

- 重构前端页面导航 UI ([d494624](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d4946244fd400f1d3c192e753d66ebe35ae1e932))
- 重构优化消息显示的 UI (使用 @ant-design/x) ([fe44b2c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fe44b2c03e1ee802291f2be7fb0e6a2303e3b328))
- 重做说话聊天界面, 大幅优化交互效果 ([e6aac6f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e6aac6ff9afafaac27b43e14487712ea28949ac2))
- 重做文字聊天界面, 大幅优化交互效果 ([f592562](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f5925624bef7b431986d36ae0624b4f8ec40cfaa))

### Improvements

- 使用缓存减少推理模型 API 测试频率 ([135a7da](https://github.com/LeafYeeXYZ/CyberLeaf/commit/135a7dabd08ff26ed29cc08962098a915670f981))
- 使用结果缓存优化 F5 TTS 测试效率 ([c3bdf51](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c3bdf51288d3b6138f3ef88ccc0016db8022f7f8))
- 优化拆分句子的正则 ([dd1799f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/dd1799f7ad10c68171060e8de1bb3d8b9fd236ba))
- 优化记忆界面的描述 ([054aa21](https://github.com/LeafYeeXYZ/CyberLeaf/commit/054aa2119a72ebbb2307393ebf2749523ac4f012))
- 优化移动端显示效果 ([e6b0cdb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e6b0cdb6760041800ec2469c495288e9e18d6227))

## 1.0.0 (2025-01-05)

### Features

- 把记忆拆分为多个页面 ([cc2ccdf](https://github.com/LeafYeeXYZ/CyberLeaf/commit/cc2ccdf2fce75ac3b5dba119109f925e349cef4a))
- 把聊天拆分为多个页面 ([e8c8d4b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e8c8d4ba42ada8582d05613bb940e68d5124efc8))
- 把设置拆分为多个页面 ([c2a504c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c2a504ca7117f700dd51821cb0a4852a059cca67))
- 持久化存储记忆负荷并优化页面显示 ([44bf2aa](https://github.com/LeafYeeXYZ/CyberLeaf/commit/44bf2aaedcc90dc742e12607cf4137be95e8e852))
- 当前上下文携带时间信息 ([1c54ac2](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1c54ac2b9e2cc5e93fd0f8b05d3a7934cb052c30))
- 更改 Fish Speech 测试方法 ([36ee0f5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/36ee0f56c505541d15a0bf24b4c010569bb7d8e7))
- 更改 Fish Speech 测试方法 ([38d4ac5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/38d4ac5e9fdc65363406c4ee9a99707e36a2ee95))
- 更新记忆结构类型定义 ([5a316dd](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5a316ddfb036ad9558a836ffb512067d5d0d74a0))
- 更新记忆时添加记忆存档 ([76619b5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/76619b55f3b7d533007e4aaee0d57b209c6b921a))
- 更新长时记忆定义 ([4ddda2a](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4ddda2a89ec2107c2ff93ada8e3381e0e5084b6b))
- 基本框架完成 ([ffd1b12](https://github.com/LeafYeeXYZ/CyberLeaf/commit/ffd1b1255792f1a05294470ba42c5e58b979b671))
- 基础架构设计 ([1036106](https://github.com/LeafYeeXYZ/CyberLeaf/commit/10361064c3d61047a187666293dd27b90dce3669))
- 计算和保存上次使用的 Token 量为“记忆负荷" ([eb3e94f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/eb3e94f1e78883d69294f23fe453b958042c00af))
- 记忆功能初步完成! ([dc7a19a](https://github.com/LeafYeeXYZ/CyberLeaf/commit/dc7a19a21de1c18c40769d0e9494e2616d269145))
- 加快系统状态检查 ([25b5f3e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/25b5f3e82314af4922b763cb2340eca32503eaef))
- 界面框架完成 ([9509a18](https://github.com/LeafYeeXYZ/CyberLeaf/commit/9509a18bc612cfaed3421449eab0d918969851ff))
- 可通过应用内设置 TTS 服务地址 ([2a2f7b3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/2a2f7b3600a5d97c9a5ce7ce32f5754f99b52684))
- 聊天实现替换为短时记忆 ([e846a5b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e846a5b52fa000d4217c7203700859b4dc48fb7a))
- 名字和真实时间系统 ([88ccea5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/88ccea53b09e352fab2aff895bcec128cbed24ee))
- 设置推理服务地址时自动末尾补"/" ([d48eb97](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d48eb976f2bbbdc642f2988bc0f1373984ba0100))
- 实现连续语音对话功能 ([61efc8c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/61efc8c93ff07e143fa68cb7600268fab19b7a6d))
- 实验性地支持 F5 TTS API ([6fb4112](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6fb41123f71357b1729381bf567906578354b1cf))
- 添加单进程锁 ([6bd5164](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6bd51640ab3212701b8cf11f226ae6fae5f286aa))
- 添加一个模型 ([5e73678](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5e73678fc6f1e3c7e77387194af7d539dc56d31f))
- 添加一个模型 ([49be8a9](https://github.com/LeafYeeXYZ/CyberLeaf/commit/49be8a9570e308121babeb33a723b123dc14c03c))
- 添加一些模型 ([6429610](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6429610907ca811bfc28e571422d54c553588c1b))
- 完善记忆负荷计算功能 ([fcc1448](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fcc1448e6e7913a2e2e49158998f436804fcc9c0))
- 完善架构, 新增记忆导出和清空 ([d510a1c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d510a1cfaaf834c6228008f873e4bf96f85e26ae))
- 网页端版本使用在线 API ([fe2c19f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fe2c19fbc8b1332cb323757f0c6504c8737ca5e7))
- 为未来的实时对话提供回调函数支持 ([462bf0e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/462bf0e45761d3a2f0ea669df3cb9e83f62d622d))
- 细化对话过程的提示 ([c5d0836](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c5d0836b43e376a9756bc9c01f6e6b4f191a173d))
- 限制窗口最小尺寸 ([e3c89b4](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e3c89b448069cc83e478136968870836efda08cc))
- 新增一个模型 ([4badd32](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4badd3202d616edc29b10718f8da561699d54618))
- 优化对话中的时间信息 ([8236acb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/8236acba02bb5e6551283a9bd69406b6bbc518e8))
- 优化环境变量使用方式 ([4d1367d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4d1367d118906ee3ca7cd62a35defc39e9ba8600))
- 优化记忆界面的描述 ([3fc80ba](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3fc80baf491d0012fa845654cde26673f90112d6))
- 优化加载动画 ([69f6236](https://github.com/LeafYeeXYZ/CyberLeaf/commit/69f6236d395798373c197ba58378945071993142))
- 优化逻辑 ([b8ef875](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b8ef87590d15da6d902fc263ca9cbc296a50d55d))
- 优化设置最大 Tokens 的类型限制 ([042fde3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/042fde313ec9281521e6c458ac2ad4f9b33f549d))
- 优化提示 ([1b3920c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1b3920c59597c79159ae7966c9d9f7330e801c90))
- 优化验证服务状态的方式 ([792946d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/792946da1ca4cb1545f13d85bf092c17b2c12301))
- 语音输出功能正式可用 ([a0b49e0](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a0b49e0ad505468391549f9ff943b4148574bcd8))
- 允许不使用 Structured Output ([f3178a7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f3178a72457f1b3dc4cacbdb421d22376d3f2494))
- 允许清除当前对话 ([fb1eaf7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fb1eaf7773f521c1235ea9fb31c2efb29fc46c21))
- 允许通过环境变量进行自定义设置 ([4b1c9c3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4b1c9c34c13bb90f68c693d709b20c6a3764c94f))
- 允许在应用内设置推理服务 ([71418af](https://github.com/LeafYeeXYZ/CyberLeaf/commit/71418af24caab49668a755e73bcfc3ca7f3cb781))
- 允许自定义聊天服务标签 ([3c17566](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3c1756697b56a6a3a77f5723b4248d0c0937b83e))
- 支持 Hugging Face Space 上的 F5 TTS API ([0d961a7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/0d961a7470aa5651dd846af24424aec1b4fe2d7b))
- 支持导入记忆功能 ([d599d5f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d599d5f52ce0ed02fa4af20572ad671946aef7a5))
- 支持获取实时天气信息 ([4d20350](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4d20350feafce808ee7fce157e446b61f3e0b3dc))
- 支持设置背景 ([81ed067](https://github.com/LeafYeeXYZ/CyberLeaf/commit/81ed06718cd9822f012225bade3badbbbe72feb0))
- 支持使用 Fish Speech 进行语音对话 ([a059e1b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a059e1b2defc7a3a8d0cd4f1d6f2ce3c2d2f05a6))
- 支持网页端使用 ([ce15aa2](https://github.com/LeafYeeXYZ/CyberLeaf/commit/ce15aa2c7e5bd93420a81eb8ba1d9ff0a91d3ac0))
- 支持语音输入识别 ([d13055e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d13055e706a968897ba4874e0d841e30efe54f04))
- 总结记忆时包含时间信息 ([2849658](https://github.com/LeafYeeXYZ/CyberLeaf/commit/2849658481adc31aa8559a56016e90b764e6451a))
- **web:** 支持使用 Tranformers.js 推理 ([5182354](https://github.com/LeafYeeXYZ/CyberLeaf/commit/51823544c948fda110e629b9e75bb1db7df8460c))

### Bug Fixes

- 更新记忆时重置记忆负荷 ([3c4328c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3c4328cd3d5455c4b2eec70e449e33cae21b41e5))
- 消息通知加载 ([c53a55e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c53a55ec1456043d06c814a0837eae94ed83b75e))
- 修复 VITE 构建错误问题 ([c42658b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c42658b009c2afd84e4f89538bda054a09b0926e))
- 修复 Web 构建错误 ([ea09c37](https://github.com/LeafYeeXYZ/CyberLeaf/commit/ea09c3750b0892ae4577c9082de5792dc26b538e))
- 修复记忆压力显示的潜在问题 ([9c12327](https://github.com/LeafYeeXYZ/CyberLeaf/commit/9c12327d94e138750f1d8b19645cc0cfc31c9e17))
- 修复间接计算 Token 错误 ([1a4814d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1a4814d7d2722dca79999fcfc0131b8aa706acb8))
- 修复间接计算 Token 错误 ([6fdfe5f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6fdfe5fa23677b729ce6c68b46fd83402a8efb55))
- 修复连续语音对话中的问题 ([3f1bd88](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3f1bd883fd28e375a768e1d512b7bd4e879b4273))
- 修复模型隐藏的问题 ([b7d33f1](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b7d33f1105bd8f9c123d8fc5046b0847c3f5eb63))
- 修复切换 Speak API 不生效问题 ([38f3dda](https://github.com/LeafYeeXYZ/CyberLeaf/commit/38f3ddaba7a5e525bcb0b0d0815107feee630f13))
- 修复样式错误 ([17f51a1](https://github.com/LeafYeeXYZ/CyberLeaf/commit/17f51a1ddabdf81bf18abe2f061e2b0ea28a1d5b))
- 修复一个导致 Web 构建失败的 Bug ([8e4a7e2](https://github.com/LeafYeeXYZ/CyberLeaf/commit/8e4a7e282cf2593e85821baa51384b3fc4342c2c))
- 优化符号检测的正则表达式 ([021a946](https://github.com/LeafYeeXYZ/CyberLeaf/commit/021a9468f2e348c1d61cdf33a7b24bd157c2af1d))
- 中文波浪线断句问题 ([cba37e4](https://github.com/LeafYeeXYZ/CyberLeaf/commit/cba37e454d7a73d72652b36ea853be52ca52d5cd))
- **web:** 修复服务地址笔误 ([58b0799](https://github.com/LeafYeeXYZ/CyberLeaf/commit/58b0799b9c35c39c2f6487ffb63d50d2f9f807af))
- **web:** 移除 Web 端的 Token 计数功能 (API 不支持) ([b8d5107](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b8d5107b3864d32aa288e881b6a1b09cfd54089e))

### Refactoring

- 把保存功能外部化 ([61d08d1](https://github.com/LeafYeeXYZ/CyberLeaf/commit/61d08d1dbdbdb6f028fa523cbebca14350916ff0))
- 不再使用流式传输和分块语音 ([7ec0333](https://github.com/LeafYeeXYZ/CyberLeaf/commit/7ec033359b47042daf91695d46f36904509353bb))
- 拆分不同的 API ([7c99550](https://github.com/LeafYeeXYZ/CyberLeaf/commit/7c995509907619d7c722d8880b5a7b5471d3e5c4))
- 基于未来的记忆模型设计, 统一使用 ollama 进行推理 ([1a4f7f3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1a4f7f33c901368756d03c2ba4d31286fc155ac7))
- 可以在应用内设置最大 Tokens ([253b889](https://github.com/LeafYeeXYZ/CyberLeaf/commit/253b889d44c393161f058cfbadb5b271e800a8a3))
- 实现 Live2d 和语音回复 ([a63d34e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a63d34e21c29794ce1ecf54e86196dcbd75aee8e))
- 使用 OpenAI SDK 进行推理 ([eb20383](https://github.com/LeafYeeXYZ/CyberLeaf/commit/eb20383fe9f284a1663d0075ec7c9e6f46fec19a))
- 统一两端的 Live2d API ([1152ac0](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1152ac0046aa16e3e023571e0ef33bf3b22f0810))
- 优化 API 架构 ([48dd21c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/48dd21c99b8bf084c71c22eabeee34514ab0cff6))
- 重构项目结构 ([7de3083](https://github.com/LeafYeeXYZ/CyberLeaf/commit/7de308369522f8f9f9866a67f5fb7fc19ab3037d))
- 重命名项目 ([2103a7f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/2103a7fb005279fe762820b5e5d47334e33aae73))
- rename project to cyber-leaf ([5646af9](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5646af978322aabb0ce878749c7d3a4d56669c4f)), closes [#2](https://github.com/LeafYeeXYZ/CyberLeaf/issues/2)
- use tauri ([f548a45](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f548a458e4f12cbd669e4a477a92f57fa27e82d0))

### Improvements

- 等待开始播放语音后在播放消息 ([32f3ef4](https://github.com/LeafYeeXYZ/CyberLeaf/commit/32f3ef49dc96313c6f11b2da1179da3a936220b0))
- 调整任务开始的顺序 ([d15e760](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d15e7609bec26385c3f6356b6f94b9bd28ca7228))
- 新增结束录音提示 ([4da7efb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4da7efb05b9f709dfcf35b10e71aa048f8fd9e91))
- 优化 F5 TTS API 的测试方法 ([183d862](https://github.com/LeafYeeXYZ/CyberLeaf/commit/183d8620d03f14f2a9341ae084b836f994f2ee97))
- 优化 Hugging Face API 错误报告 ([6de4338](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6de4338e30a9264a4751c674f138a23cdc49bf9b))
- 优化当前状态提示 ([a4b8cae](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a4b8cae0f3a6bd1c9e4063571f2d9f3338c0d4de))
- 优化对话时的加载显示效果 ([f2648fb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f2648fb97914b628a313bf3bda086d92186b8b84))
- 优化界面布局 ([e26b5e7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e26b5e776319a52b3986d6448909e2d3bb56c10f))
- 优化句子拆分 ([b330b0d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b330b0d5ee5dc68d4a145987cf3c7655370e439c))
- 优化默认 TTS 设置 ([5b51272](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5b51272879574f669c040d84fbf26536fb30fd6c))
- 优化排版 ([5ca30dc](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5ca30dc6ec2bfe6494105b1b4f9366af2c2f5eab))
- 优化设置界面外观 ([f29c8c7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f29c8c79ea6deabe792f6d0a4572cb9b3607ff97))
- 优化文字显示的停顿 ([8ae3268](https://github.com/LeafYeeXYZ/CyberLeaf/commit/8ae3268f96e6759474de5cf910876430a2094645))
- 优化系统状态检查逻辑 ([c485642](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c48564272729016652a0d8998c3d69303ca49249))
- 优化逐字打印的效果 ([1f68241](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1f6824197113ca4ffbd139027d39c76738f93c8a))
- **web:** 优化代码分块 ([88cfc56](https://github.com/LeafYeeXYZ/CyberLeaf/commit/88cfc56a46a93225457abba70ffe77ad42f4d632))

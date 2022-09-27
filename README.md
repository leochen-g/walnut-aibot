# 5G智能微秘书

#### 介绍

智能微秘书，你的5G智能助理，一键接入可视化平台，让5G消息开发更简单。通过可视化平台可以对接来也机器人，图灵机器人，微信开放对话平台，天行机器人等众多ai智能机器人对话平台。同时本项目也内置了
丰富的助理功能供用户使用：定时提醒、新闻资讯播报、定时任务、每日一句、openapi等众多功能

#### 功能说明

* 定时提醒

- [x] 当天定时提醒 例："提醒 我 18:00 下班了，记得带好随身物品"
- [x] 每天定时提醒 例："提醒 我 每天 18:00 下班了，记得带好随身物品"
- [x] 指定日期提醒 例："提醒 我 2019-05-10 8:00 还有 7 天是女朋友生日了，准备一下"

* 智能机器人

- [x] 天行机器人
- [x] 图灵机器人
- [x] 腾讯闲聊机器人
- [x] 来也对话式AI平台
- [ ] 更多

* 定时任务

- [x] 新闻定时发送
- [x] 消息定时发送
- [x] 每日说,定时给用户发送每日天气提醒，以及每日一句
- [ ] 更多功能等你来 pr

* 关键词

- [x] 关键词回复
- [x] 关键词事件
    - [x] 天气查询 例："上海天气"
    - [x] 垃圾分类 例："?香蕉皮"
    - [x] 名人名言 例： "名人名言"
    - [x] 老黄历查询 例： "黄历 2019-6-13"
    - [x] 姓氏起源 例： "姓陈"
    - [x] 星座运势 例： "\*双子座"
    - [x] 神回复 例： "神回复"
    - [x] 获取表情包 例： "表情包你好坏"
    - [x] 获取美女图 例： "美女图"
    - [ ] 更多待你发现

* 素材

- [x] 文字素材
    - [x] 支持添加悬浮建议
- [x] 文件素材
    - [x] 支持添加悬浮建议
- [x] 富文本卡片素材
    - [x] 支持添加建议回复
- [x] 多富文本卡片素材
    - [x] 支持添加悬浮建议
    - [x] 支持添加建议回复

* 自动更新配置文件，无需重启

* 特色功能

- [x] 主动发送消息
- [x] 主动更新配置
- [x] 主动同步用户信息
- [x] openapi

#### 软件架构

> Node > 16 
> 
> Wechaty >= 1.18.1 
> 
>wechaty-puppet-walnut >= 1.18.4

#### 接入文档

1、5G智能微秘书注册账号，个人中心获取apikey和apisecret

注册地址：[http://walnut.aibotk.com/](http://walnut.aibotk.com/)

2、拉取项目，根目录`index.js`中配置注册后获取到的apikey和apisecret，以及5G平台申请的appId和appKey


```javascript
const {WechatyBuilder} = require('wechaty')
const WechatyWebPanelPlugin = require('./plugin/index');
let bot = '';
const name = 'walnut-aibot';
bot = WechatyBuilder.build({
    name, // generate xxxx.memory-card.json and save login data for the next login
    puppet: 'wechaty-puppet-walnut',
    puppetOptions: {
        sipId: '****', // Chatbot的sipId
        appId: '******', // Chatbot的AppId
        appKey: '*******' // Chatbot的AppKey
    },
});

bot.use(
    WechatyWebPanelPlugin({
        apiKey: '*******', // 微秘书平台apikey
        apiSecret: '*******', // 微秘书平台apisecret
    })
)
bot.start()
    .catch((e) => console.error(e));

```

3、安装依赖并启动

```bash
npm install
npm run start
```

#### 使用说明

启动完成后，针对所有功能的配置都可在智能微秘书平台进行

import { dispatchAiBot, dispatchEventContent } from './event-dispatch-service.js'
import { setSchedule, updateSchedule } from '../proxy/aibotk.js'
import { contentDistinguish, setLocalSchedule, isRealDate } from '../lib/index.js'

function emptyMsg() {
  let msgArr = [] // 返回的消息列表
  let obj = { type: 1, content: '我在呢', url: '' } // 消息主体
  msgArr.push(obj)
  return msgArr
}

function officialMsg() {
  console.log('字符超200字符，无效或官方消息，不做回复')
  return [{ type: 1, content: '', url: '' }]
}

/**
 * 添加定时提醒
 * @param that wechaty实例
 * @param obj 定时对线
 * @returns {Promise<boolean>}
 */
async function addSchedule(that, obj) {
  try {
    let scheduleObj = await setSchedule(obj)
    let nickName = scheduleObj.subscribe
    let time = scheduleObj.time
    let Rule1 = scheduleObj.isLoop ? time : new Date(time)
    let content = scheduleObj.content
    let contact = await that.Contact.find({ name: nickName })
    let id = scheduleObj.id
    setLocalSchedule(Rule1, async () => {
      console.log('你的专属提醒开启啦！')
      await contact.say(content)
      if (!scheduleObj.isLoop) {
        updateSchedule(id)
      }
    })
    return true
  } catch (error) {
    console.log('设置定时任务失败', error)
    return false
  }
}

async function scheduleJobMsg({ that, msg, name }) {
  try {
    let obj = { type: 1, content: '', url: '' } // 消息主体
    let msgArr = msg.replace(/\s+/g, ' ').split(' ')
    if (msgArr.length > 3) {
      let schedule = contentDistinguish(msgArr, name)
      let time = schedule.isLoop ? schedule.time : isRealDate(schedule.time)
      if (time) {
        let res = await addSchedule(that, schedule)
        if (res) {
          obj.content = '小助手已经把你的提醒牢记在小本本上了'
        } else {
          obj.content = '添加提醒失败，请稍后重试'
        }
        msgArr.push(obj)
        return msgArr
      } else {
        obj.content = '提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)每天(空格)18:30(空格)下班回家'
        msgArr.push(obj)
        return msgArr
      }
    } else {
      obj.content = '提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家”'
      msgArr.push(obj)
      return msgArr
    }
  } catch (e) {
    console.log('scheduleJobMsg error:', e)
    return []
  }
}

/**
 * 获取事件处理返回的内容
 * @param {*} event 事件名
 * @param {*} msg 消息
 * @param {*} name 用户
 * @param {*} id 用户id
 * @param avatar 用户头像
 * @returns {String}
 */
async function getEventReply(that, event, msg, name, id, avatar, room, key) {
  try {
    let reply = dispatchEventContent(that, event, msg, name, id, avatar, room, key)
    return reply
  } catch (e) {
    console.log('getEventReply error', e)
    return []
  }
}

async function eventMsg({ that, msg, name, id, avatar, config, room }) {
  try {
    for (let item of config.eventKeywords) {
      for (let key of item.keywords) {
        if ((item.reg === 1 && msg.includes(key)) || (item.reg === 2 && msg === key)) {
          msg = msg.replace(key, '')
          let res = getEventReply(that, item.event, msg, name, id, avatar, room, key)
          return res
        }
      }
    }
    return []
  } catch (e) {
    console.log('eventMsg error：', e)
    return []
  }
}

/**
 * 关键词回复
 * @returns {Promise<*>}
 */

async function keywordsMsg({ msg, config }) {
  try {
    if (config.replyKeywords && config.replyKeywords.length > 0) {
      for (let item of config.replyKeywords) {
        if (item.reg === 2 && item.keywords.includes(msg)) {
          console.log(`精确匹配到关键词${msg},正在回复用户`)
          return item.replys
        } else if (item.reg === 1) {
          for (let key of item.keywords) {
            if (msg.includes(key)) {
              console.log(`模糊匹配到关键词${msg},正在回复用户`)
              return item.replys
            }
          }
        }
      }
    } else {
      return []
    }
  } catch (e) {
    console.log('keywordsMsg error：', e)
    return []
  }
}

async function robotMsg({ msg, name, id, config }) {
  try {
    let msgArr = [] // 返回的消息列表
    let obj = { type: 1, content: '', url: '' } // 消息主体
    if (config.autoReply) {
      console.log('开启了机器人自动回复功能')
      obj.type = 1
      obj.content = await dispatchAiBot(config.defaultBot, msg, name, id)
    } else {
      console.log('没有开启机器人自动回复功能')
      obj.type = 1
      obj.content = ''
    }
    msgArr.push(obj)
    return msgArr
  } catch (e) {
    console.log('robotMsg error:', e)
    return []
  }
}


export {
  emptyMsg,
  officialMsg,
  scheduleJobMsg,
  eventMsg,
  keywordsMsg,
  robotMsg,
}

import { allConfig } from '../common/configDb.js'
import * as msgFilter from './msg-filters.js'
const REMINDKEY = '提醒'

async function getMsgReply(resArray, { that, msg, name, contact, config, avatar, id, room }) {
  try {
    let msgArr = []
    for (let i = 0; i < resArray.length; i++) {
      const item = resArray[i]
      if (item.bool) {
        msgArr = (await msgFilter[item.method]({ that, msg, name, contact, config, avatar, id, room })) || []
      }
      if (msgArr.length > 0) {
        return msgArr
      }
    }
    return []
  } catch (e) {
    console.log('getMsgReply error', e)
    return []
  }
}

/**
 * 微信好友文本消息事件过滤
 *
 * @param that wechaty实例
 * @param {Object} contact 发消息者信息
 * @param {string} msg 消息内容
 * @returns {number} 返回回复内容
 */
async function filterFriendMsg(that, contact, msg) {
  try {
    const config = await allConfig() // 获取配置信息
    const name = contact.name()
    const id = contact.id
    const avatar = await contact.avatar()
    const resArray = [
      { bool: msg === '', method: 'emptyMsg' },
      { bool: msg.startsWith(REMINDKEY), method: 'scheduleJobMsg' },
      { bool: config.eventKeywords && config.eventKeywords.length > 0, method: 'eventMsg' },
      { bool: true, method: 'keywordsMsg' },
      { bool: config.autoReply, method: 'robotMsg' },
    ]
    const msgArr = await getMsgReply(resArray, { that, msg, contact, name, config, avatar, id })
    return msgArr.length > 0 ? msgArr : [{ type: 1, content: '', url: '' }]
  } catch (e) {
    console.log('filterFriendMsg error', e)
  }
}

export {
  filterFriendMsg,
}

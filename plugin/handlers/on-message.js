import { contactSay } from '../common/index.js'
import { getContactTextReply } from '../common/reply.js'
import { delay } from '../lib/index.js'

/**
 * 根据消息类型过滤私聊消息事件
 * @param {*} that bot实例
 * @param {*} msg 消息主体
 */
async function dispatchFriendFilterByMsgType(that, msg) {
  try {
    const type = msg.type()
    const contact = msg.talker() // 发消息人
    const isOfficial = contact.type() === that.Contact.Type.Official
    let content = ''
    let replys = []
    switch (type) {
      case that.Message.Type.Text:
        console.log('msg', msg)
        content = msg.text()
        if (!isOfficial) {
          console.log(`发消息人${await contact.name()}:${content}`)
          if (content.trim()) {
            replys = await getContactTextReply(that, contact, content)
            for (let reply of replys) {
              await delay(1000)
              await contactSay.call(that, contact, reply)
            }
          }
        } else {
          console.log('公众号消息')
        }
        break
      case that.Message.Type.Emoticon:
        console.log(`发消息人${await contact.name()}:发了一个表情`)
        break
      case that.Message.Type.Image:
        console.log(`发消息人${await contact.name()}:发了一张图片`)
        break
      case that.Message.Type.Url:
        console.log(`发消息人${await contact.name()}:发了一个链接`)
        break
      case that.Message.Type.Video:
        console.log(`发消息人${await contact.name()}:发了一个视频`)
        break
      case that.Message.Type.Audio:
        console.log(`发消息人${await contact.name()}:发了一个音频`)
        break
      case that.Message.Type.Contact:
        console.log(`发消息人${await contact.name()}:发了一个联系人`)
        break
      case that.Message.Type.Location:
        console.log(`发消息人${await contact.name()}:发了一个位置`)
        break
      default:
        break
    }
  } catch (error) {
    console.log('监听消息错误', error)
  }
}

export async function onMessage(msg) {
  try {
    const msgSelf = msg.self() // 是否自己发给自己的消息
    if (msgSelf) return
    await dispatchFriendFilterByMsgType(this, msg)
  } catch (e) {
    console.log('监听消息失败', e)
  }
}

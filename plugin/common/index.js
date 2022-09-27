import {getNews, getTXweather, getSweetWord} from '../proxy/api.js'
import {sendFriend,  asyncData, getOne, getMaterial} from '../proxy/aibotk.js'
import {getUser} from './userDb.js'
import {formatDate, getDay, MD5, groupArray, delay} from '../lib/index.js'
import {FileBox} from 'file-box'
import { sendTextMessage, sendPostMessage, sendFileMessage, sendMorePostMessage } from 'wechaty-puppet-walnut-gateway'


/**
 * 获取每日新闻内容
 * @param {*} sortId 新闻资讯分类Id
 * @param {*} endWord 结尾备注
 */
async function getEveryDayRoomContent(sortId, endWord = '微信小助手') {
    let today = formatDate(new Date()) //获取今天的日期
    let news = await getNews(sortId)
    let content = `${today}\n${news}\n———${endWord}`
    return content
}

/**
 * 获取每日说内容
 * @param {*} date 与朋友的纪念日
 * @param {*} city 朋友所在城市
 * @param {*} endWord 结尾备注
 */
async function getEveryDayContent(date, city, endWord) {
    let one = await getOne() //获取每日一句
    let weather = await getTXweather(city) //获取天气信息
    let today = formatDate(new Date()) //获取今天的日期
    let memorialDay = getDay(date) //获取纪念日天数
    let sweetWord = await getSweetWord() // 土味情话
    let str = `${today}\n我们在一起的第${memorialDay}天\n\n元气满满的一天开始啦,要开心噢^_^\n\n今日天气\n${weather.weatherTips}\n${weather.todayWeather}\n每日一句:\n${one}\n\n情话对你说:\n${sweetWord}\n\n————————${endWord}`
    return str
}

/**
 * 更新用户信息
 */
async function updateContactInfo(that) {
    try {
        const contactSelf = await getUser()
        const hasWeixin = !!contactSelf.weixin
        const contactList = await that.Contact.findAll()
        let res = []
        const notids = ['filehelper', 'fmessage']
        let realContact = hasWeixin
            ? contactList.filter((item) => {
                const payload = item.payload || item._payload
                return payload.type === 1 && payload.friend && !notids.includes(payload.id)
            })
            : contactList
        for (let i of realContact) {
            let contact = i.payload || i._payload
            let obj = {
                robotId: hasWeixin ? contactSelf.weixin : MD5(contactSelf.name),
                contactId: hasWeixin ? contact.id : MD5(contactSelf.name + contact.name + contact.alias + contact.province + contact.city + contact.gender),
                name: contact.name,
                alias: contact.alias,
                gender: contact.gender,
                province: contact.province,
                city: contact.city,
                avatar: hasWeixin ? contact.avatar : '',
                friend: contact.friend,
                signature: contact.signature,
                star: contact.star,
                type: hasWeixin ? contact.type : '',
                weixin: hasWeixin ? contact.weixin : '',
            }
            res.push(obj)
        }
        await updateFriendInfo(res, 50)
    } catch (e) {
        console.log('e', e)
    }
}

/**
 * 分批次更新好友信息
 * @param {*} list 好友列表
 * @param {*} num 每次发送数据
 */
async function updateFriendInfo(list, num) {
    const arr = groupArray(list, num)
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        await sendFriend(item)
        await delay(500)
    }
}

/**
 * 私聊发送消息
 * @param contact
 * @param msg
 * @param isRoom
 *  type 1 文字 2 图片url 3 图片base64 4 url链接 5 小程序  6 名片 7 富文本卡片 8 多富文本卡片
 */
async function contactSay(contact, msg, isRoom = false) {
    const contactId = contact.id
    console.log('msg', msg)
    if(msg.id) {
      msg = await getMaterial(msg.id)
    }
    try {
        switch (msg.type) {
            case 1:
                if (msg.content) {
                    console.log('回复内容', msg.content)
                    if(msg.suggestions&&msg.suggestions.length) {
                        await sendTextMessage(contactId, msg.content, msg.suggestions)
                    }else {
                        await contact.say(msg.content)
                    }
                }
                break;
            case 2:
                if (msg.url) {
                    // url文件
                    let obj = FileBox.fromUrl(msg.url)
                    console.log('回复内容', obj, contactId)
                    if(msg.suggestions&&msg.suggestions.length) {
                        await sendFileMessage(contactId, obj, msg.suggestions)
                    }else {
                        await contact.say(obj)
                    }
                }
                break
            case 3:
                if (msg.url) {
                    // bse64文件
                    let obj = FileBox.fromDataURL(msg.url, 'user-avatar.jpg')
                    if(msg.suggestions&&msg.suggestions.length) {
                        await sendFileMessage(contactId, obj, msg.suggestions)
                    }else {
                        await contact.say(obj)
                    }
                }
                break
            case 7:
                if (msg.title && msg.summary && msg.imageUrl) {
                    let post = await this.Post.builder()
                        .add(msg.title)
                        .add(msg.summary)
                        .add(FileBox.fromUrl(msg.imageUrl))
                        .type(0)
                        .build()
                    if (msg.suggestions && msg.suggestions.length) {
                        const postMsg = post._payload || {}
                        await sendPostMessage(contactId, postMsg, msg.suggestions)
                    } else {
                        await contact.say(post)
                    }
                }
                break;
            case 8:
                if (msg.content) {
                    const cards = JSON.parse(msg.content)
                    const suggestions = msg.suggestions
                    console.log('cards', cards, suggestions)
                    const sendCards = []
                    for(let i in cards) {
                        const cardItem = cards[i]
                        let post = await this.Post.builder()
                            .add(cardItem.title)
                            .add(cardItem.summary)
                            .add(FileBox.fromUrl(cardItem.imageUrl))
                            .type(0)
                            .build()
                        const cardSuggestions = cardItem.suggestions
                        sendCards.push({ postPayload: post._payload || {}, suggestions: cardSuggestions })
                    }
                    await sendMorePostMessage(contactId, sendCards, suggestions)
                }
                break;
            default:
                break
        }
    } catch (e) {
        console.log('私聊发送消息失败', e)
    }
}

/**
 * 重新同步好友
 * @param that
 * @returns {Promise<void>}
 */
async function updateContactOnly(that) {
    const contactSelf = await getUser()
    await asyncData(contactSelf.robotId, 1)
    await delay(3000)
    await updateContactInfo(that)
}

export {
    updateContactOnly,
    getEveryDayContent,
    getEveryDayRoomContent,
    updateContactInfo,
    contactSay,
}

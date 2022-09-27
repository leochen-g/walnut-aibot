import {
    getRubbishType, getResByTXTL,
    getResByTX,
    getResByTL,
    getMingYan,
    getStar,
    getXing,
    getSkl,
    getLunar,
    getGoldReply,
    getXhy,
    getRkl,
    getEmo,
    getNcov,
    getCname,
    getNews,
} from '../proxy/api.js'
import {getConfig, getMeiNv} from '../proxy/aibotk.js'
import {getConstellation, msgArr, getNewsType} from '../lib/index.js'
import {initTaskLocalSchedule} from '../task/index.js'
import {updateContactOnly} from '../common/index.js'
import {chatTencent} from '../proxy/tencent.js'
import {chatLaiye} from '../proxy/laiyeAi.js'

/**
 * 根据事件名称分配不同的api处理，并获取返回内容
 * @param {string} eName 事件名称
 * @param {string} msg 消息内容
 * @param name
 * @param id
 * @param avatar
 * @returns {string} 内容
 */
async function dispatchEventContent(that, eName, msg, name, id, avatar, room, key) {
    try {
        let content = '',
            type = 1,
            url = '',
            suggestions = []
        switch (eName) {
            case 'rubbish':
                content = await getRubbishType(msg)
                break
            case 'mingyan':
                suggestions = [{type: 'reply', displayText: '再来一条', content: key}]
                content = await getMingYan()
                break
            case 'star':
                let xing = getConstellation(msg)
                suggestions = [
                    {type: 'reply', displayText: '双子座', content: key + '双子座'},
                    {type: 'reply', displayText: '水瓶座', content: key + '水瓶座'},
                    {type: 'reply', displayText: '天蝎座', content: key + '天蝎座'},
                    {type: 'reply', displayText: '处女座', content: key + '处女座'},
                    {type: 'reply', displayText: '射手座', content: key + '射手座'},
                ]
                content = await getStar(xing)
                break
            case 'news':
                let newsId = getNewsType(msg)
                suggestions = [
                    { type: 'urlAction', displayText: '查看详情', content: 'https://www.tianapi.com/weixin/news/?col=' + newsId },
                    {type: 'reply', displayText: '社会新闻', content: '社会' + key},
                    {type: 'reply', displayText: '国内新闻', content: '国内' + key},
                    {type: 'reply', displayText: '体育新闻', content: '体育' + key},
                    {type: 'reply', displayText: '科技新闻', content: '科技' + key},
                    {type: 'reply', displayText: '房产新闻', content: '房产' + key},
                    {type: 'reply', displayText: '汽车新闻', content: '汽车' + key},
                    {type: 'reply', displayText: '财经新闻', content: '财经' + key},
                    {type: 'reply', displayText: '足球新闻', content: '足球' + key},
                ]
                content = await getNews(newsId)
                break
            case 'xing':
                suggestions = [
                    {type: 'reply', displayText: '看看赵姓', content: key + '赵'},
                    {type: 'reply', displayText: '看看张姓', content: key + '张'},
                    {type: 'reply', displayText: '看看陈姓', content: key + '陈'},
                    {type: 'reply', displayText: '看看王姓', content: key + '王'},
                ]
                content = await getXing(msg)
                break
            case 'skl':
                suggestions = [{type: 'reply', displayText: '再来一条', content: key}]
                content = await getSkl(msg)
                break
            case 'lunar':
                content = await getLunar(msg)
                break
            case 'goldreply':
                suggestions = [{type: 'reply', displayText: '再来一条', content: key}]
                content = await getGoldReply(msg)
                break
            case 'xhy':
                suggestions = [{type: 'reply', displayText: '再来一条', content: key}]
                content = await getXhy(msg)
                break
            case 'rkl':
                suggestions = [{type: 'reply', displayText: '再来一条', content: key}]
                content = await getRkl(msg)
                break
            case 'emo':
                suggestions = [
                    {type: 'reply', displayText: '开心', content: key + '开心'},
                    {type: 'reply', displayText: '伤心', content: key + '伤心'},
                    {type: 'reply', displayText: '可爱', content: key + '可爱'},
                    {type: 'reply', displayText: '无聊', content: key + '无聊'},
                ]
                url = await getEmo(msg)
                type = 2
                break
            case 'meinv':
                suggestions = [{type: 'reply', displayText: '再来一张', content: key}]
                url = await getMeiNv()
                type = 2
                break
            case 'ncov':
                content = await getNcov()
                break
            case 'cname':
                suggestions = [{type: 'reply', displayText: '再来一个', content: key}]
                content = await getCname()
                break
            case 'reloadFriendOnly':
                await updateContactOnly(that)
                content = '更新好友列表成功，请稍等两分钟后生效'
                break
            case 'updateConfig':
                await getConfig()
                await initTaskLocalSchedule(that)
                content = '更新配置成功，请稍等一分钟后生效'
                break
            default:
                break
        }
        return msgArr(type, content, url, suggestions)
    } catch (e) {
        console.log('事件处理异常', e)
        return []
    }
}

/**
 * 派发不同的机器人处理回复内容
 * @param {*} bot 机器人类别 0 天行机器人 1 天行的图灵机器人 2 图灵机器人 3 腾讯闲聊机器人
 * @param {*} msg 消息内容
 * @param {*} name 发消息人
 * @param {*} id 发消息人id
 */
async function dispatchAiBot(bot, msg, name, id) {
    try {
        let res
        switch (bot) {
            case 0:
                res = await getResByTX(msg, id)
                break
            case 1:
                res = await getResByTXTL(msg, id)
                break
            case 2:
                res = await getResByTL(msg, id)
                break
            case 3:
                res = await chatTencent(msg, id)
                break
            case 4:
                res = await chatLaiye(msg, name, id)
                break
            default:
                res = ''
                break
        }
        return res
    } catch (e) {
        console.log('机器人接口信息获取失败', e)
        return ''
    }
}

export {
    dispatchEventContent,
    dispatchAiBot,
}

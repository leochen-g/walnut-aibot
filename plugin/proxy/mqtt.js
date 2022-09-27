import mqtt from 'mqtt'
import {allConfig} from '../common/configDb.js'
import {contactSay} from '../common/index.js'
import {getConfig, getMqttConfig} from './aibotk.js'
import {dispatchEventContent} from '../service/event-dispatch-service.js'
import {sendRoomTaskMessage, sendContactTaskMessage} from '../task/index.js'
import {randomRange} from '../lib/index.js'

async function initMqtt(that) {
    try {
        await getConfig() // 获取配置文件
        const config = await allConfig()
        const {userId, name, role} = config.userInfo
        if (role === 'vip') {
            const config = await getMqttConfig()
            const {host, port, username, password, clientId} = config
            let mqttclient = host
                ? mqtt.connect(`${host}:${port}`, {
                    username: username,
                    password: password,
                    clientId: clientId + randomRange(1, 10000),
                })
                : null
            if (mqttclient) {
                mqttclient.on('connect', function () {
                    console.debug('connect to Wechaty mqtt----------')
                    mqttclient.subscribe(`aibotk/${userId}/+`, function (err) {
                        if (err) {
                            console.log(err)
                        }
                    })
                })
                mqttclient.on('reconnect', function (e) {
                    console.log('subscriber on reconnect')
                })
                mqttclient.on('disconnect', function (e) {
                    console.log('disconnect--------', e)
                })
                mqttclient.on('error', function (e) {
                    console.debug('error----------', e)
                })
                mqttclient.on('message', async function (topic, message) {
                    const content = JSON.parse(message.toString())
                    if (topic === `aibotk/${userId}/say`) {
                        if (content.target === 'Room') {
                            console.log(`收到用户：${content.roomName}发送消息请求： ${content.message.content || content.message.url}`)
                            const contact = await that.Contact.find({name: content.roomName})
                            if (!contact) {
                                console.log(`查找不到用户：${content.roomName}，请检查用户名是否正确`)
                                return
                            } else {
                                await contactSay.call(that, contact,  content.message)
                            }
                        } else if (content.target === 'Contact') {
                            console.log(`收到联系人：${content.alias || content.name}发送消息请求： ${content.message.content || content.message.url}`)
                            let contact = (await that.Contact.find({name: content.name})) // 获取你要发送的联系人
                            if (!contact) {
                                console.log(`查找不到联系人：${content.name}，请检查联系人名称是否正确`)
                                return
                            } else {
                                await contactSay.call(that, contact, content.message)
                            }
                        }
                    } else if (topic === `aibotk/${userId}/event`) {
                        if (content.target === 'system') {
                            console.log('触发了内置事件')
                            const eventName = content.event
                            const res = await dispatchEventContent(that, eventName)
                            console.log('事件处理结果', res[0].content)
                        } else if (content.target === 'Room') {
                            console.log('触发了群事件')
                            await sendRoomTaskMessage(that, content)
                        } else if (content.target === 'Contact') {
                            console.log('触发了好友事件')
                            await sendContactTaskMessage(that, content)
                        }
                    }
                })
            }
        } else {
            return false
        }
    } catch (e) {
        console.log('mqtt 创建链接失败', e)
    }
}

export {
    initMqtt,
}

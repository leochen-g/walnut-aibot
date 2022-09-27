import {addAibotConfig} from './common/aiDb.js'

import { onLogin } from './handlers/on-login.js'
import { onLogout } from './handlers/on-logout.js'
import { onMessage } from './handlers/on-message.js'
import { onReady } from './handlers/on-ready.js'
import { onHeartBeat } from './handlers/on-heartbeat.js'
import { onError } from './handlers/on-error.js'

let envKey = ''
let envSecret = ''
if (process.env['AIBOTK_KEY']) {
    console.log('使用环境变量中的 aibotkKey')
    envKey = process.env['AIBOTK_KEY']
}
if (process.env['AIBOTK_SECRET']) {
    console.log('使用环境变量中的 aibotkSecret')
    envSecret = process.env['AIBOTK_SECRET']
}


export default function WechatyWebPanelPlugin(config = {apiKey: '', apiSecret: ''}) {
    const initConfig = {
        apiKey: envKey || config.apiKey,
        apiSecret: envSecret || config.apiSecret,
    }
    addAibotConfig(initConfig)
    return function (bot) {
        bot.on('login', onLogin)
        bot.on('logout', onLogout)
        bot.on('message', onMessage)
        bot.on('ready', onReady)
        bot.on('heartbeat', onHeartBeat)
        bot.on('error', onError)
    }
}

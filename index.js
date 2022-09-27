import {WechatyBuilder} from 'wechaty'
import WechatyWebPanelPlugin from './plugin/index.js'
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

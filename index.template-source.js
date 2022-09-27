import {WechatyBuilder} from 'wechaty'
import WechatyWebPanelPlugin from './plugin/index.js'

let bot = '';

const name = 'walnut-aibot';
bot = WechatyBuilder.build({
    name, // generate xxxx.memory-card.json and save login data for the next login
    // puppet: new PuppetWalnut(),
    puppet: 'wechaty-puppet-walnut',
    puppetOptions: {
        notifyUrlPrefix: '/sms',
        sipId: '***',
        appId: '***',
        appKey: '***'
    },
});


bot.use(
    WechatyWebPanelPlugin({
        apiKey: '***',
        apiSecret: '***',
    })
)
bot.start()
    .catch((e) => console.error(e));


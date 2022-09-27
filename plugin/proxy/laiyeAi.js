import WuLaiClient from "@laiye-ai/sdk-core"
import {allConfig} from '../common/configDb.js'
let client = ''

async function initClient() {
    const config = await allConfig()
    client = new WuLaiClient({
        pubkey: config.laiyePubkey,
        secret: config.laiyeSecret
    });
    // client = new WuLaiClient({
    //     pubkey: 'M07usIh6TU39nXKeK0DEytXnN9xWVIrA00f5507460537b4f91',
    //     secret: '3SElJ4D0MjNEqQXbyqIR'
    // });
}

async function chatLaiye(word, name, id) {
    try {

        if (!client) {
            await initClient()
        }
        // 1. 创建用户（如未创建过）
        await client.createUser({
            user_id: id,
            avatar_url: "https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/rc-upload-1521637604400-2-login_logo.png",
            nickname: name
        });
        const res = await client.getBotResponse({
            msg_body: {
                text: {
                    content: word
                }
            },
            user_id: id
        })
        console.log('res', res.suggested_response[0].response[0].msg_body.text.content )
        return res.suggested_response[0].response[0].msg_body.text.content
    } catch (e) {
        console.log('来也请求失败：', e)
    }
}
export {
    chatLaiye,
}

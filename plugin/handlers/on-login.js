import { delay, MD5 } from '../lib/index.js'
import { getConfig, sendRobotInfo, sendError, setQrCode, updatePanelVersion } from '../proxy/aibotk.js'
import { addUser } from '../common/userDb.js'
import { initAllSchedule } from '../task/index.js'
import { initMqtt } from '../proxy/mqtt.js'

/**
 * 登录成功监听事件
 * @param {*} user 登录用户
 */
export async function onLogin(user) {
  try {
    console.log(`5G贴心助理${user}登录了`)
    await updatePanelVersion()
    await setQrCode('', 4)
    await sendError('')
    await getConfig() // 获取配置文件
    const payload = user.payload || user._payload
    const userInfo = {
      ...payload,
      robotId: MD5(user.name()),
    }
    await addUser(userInfo) // 全局存储登录用户信息
    const avatarUrl = 'https://img.aibotk.com/aibotk/public/yq3wWdBL0BnJV4Z1_xzslogo.jpg'
    await sendRobotInfo(avatarUrl, user.name(), userInfo.robotId) // 更新用户头像
    await delay(3000)
    await initAllSchedule(this) // 初始化任务
    await initMqtt(this) // 初始化mqtt任务
  } catch (e) {
    console.log('登录后初始化失败', e)
  }
}

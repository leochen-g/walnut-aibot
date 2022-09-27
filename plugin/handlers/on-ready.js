import {updateContactInfo} from '../common/index.js'
import {  sendHeartBeat} from '../proxy/aibotk.js'
import { getUser } from '../common/userDb.js'

/**
 * 准备好的事件
 */
export async function onReady() {
  try {
    const userInfo = await getUser()
    console.log(`所有数据准备完毕`)
    await sendHeartBeat('live')
    await updateContactInfo(this)
  } catch (e) {
    console.log('on ready error:', e)
  }
}

import { setQrCode } from '../proxy/aibotk.js'

/**
 * 登出事件
 */
export async function onLogout(user) {
  await setQrCode('qrcode', '6')
  console.log(`用户${user}已登出`)
}

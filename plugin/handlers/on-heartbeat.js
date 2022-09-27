import { sendHeartBeat } from '../proxy/aibotk.js'

export async function onHeartBeat(str) {
  if (!str) {
    await sendHeartBeat('dead')
  }
  if (str.type === 'scan') {
    await sendHeartBeat('scan')
  }
}

import { filterFriendMsg } from '../service/msg-filter-service.js'
/**
 * 获取私聊返回内容
 */
export async function getContactTextReply(that, contact, msg) {
  return filterFriendMsg(that, contact, msg)
}

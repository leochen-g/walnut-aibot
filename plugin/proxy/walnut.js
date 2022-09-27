import {uploadFile, sendMessage} from 'wechaty-puppet-walnut-gateway'

const suggest = [
    {
        type: 'text',
        displayText: '建议1',
    },
    {
        type: 'h5',
        displayText: '建议1',
        content: 'http://www.baidu.com'
    },
    {
        type: 'call',
        displayText: '建议1',
        content: '17928222350'
    },
]

function dealSuggestion(list) {
    if (!list || !list.length) return []
    const res = list.map(item => {
        if (item.type === 'text') {
            return {
                "reply": {
                    "displayText": item.displayText,
                    "postback": {
                        "data": "walnut-aibot-callback-text"
                    }
                }
            }
        } else if (item.type === 'h5') {
            return {
                "action": {
                    "urlAction": {
                        "openUrl": {
                            "url": item.content,
                            "application": "webview",
                            "viewMode": "half"
                        }
                    },
                    "displayText": item.displayText,
                    "postback": {
                        "data": "walnut-aibot-callback-h5"
                    }
                }
            }
        } else if (item.type === 'call') {
            return {
                "action": {
                    "dialerAction": {
                        "dialPhoneNumber": {
                            "phoneNumber": item.content
                        }
                    },
                    "displayText": item.displayText,
                    "postback": {
                        "data": "set_by_chatbot_open_dialer-call"
                    }
                }
            }
        }
    })
    return res
}

/**
 * 发送富文本带建议
 * @param contactId
 * @param postPayload
 * @param suggestions
 * @returns {Promise<void>}
 */
async function sendSuggestPost(contactId, postPayload, suggestions) {
    console.log(contactId, postPayload, suggestions)
    const title = postPayload.sayableList[0]
    const description = postPayload.sayableList[1]
    const img = postPayload.sayableList[2]
    const suggest = dealSuggestion(suggestions)
    if (title.type !== 'Text' || description.type !== 'Text' || img.type !== 'Attachment') {
        throw new Error('Wrong Post!!! please check your Post payload to make sure it right')
    }
    const fileItem = await uploadFile(true, img.payload.filebox)
    const msg = {
        contentEncoding: 'utf-8',
        contentText: {
            message: {
                generalPurposeCard: {
                    content: {
                        description: description.payload.text,
                        media: {
                            height: 'MEDIUM_HEIGHT',
                            mediaContentType: fileItem.contentType,
                            mediaFileSize: fileItem.fileSize,
                            mediaUrl: fileItem.url,
                        },
                        title: title.payload.text,
                        suggestions: suggest
                    },
                    layout: {
                        cardOrientation: 'HORIZONTAL',
                        descriptionFontStyle: ['calibri'],
                        imageAlignment: 'LEFT',
                        titleFontStyle: ['underline', 'bold'],
                    },
                },
            },
        },
        contentType: 'application/vnd.gsma.botmessage.v1.0+json',
    }
    sendMessage(contactId, msg)
}

export {
    sendSuggestPost
}

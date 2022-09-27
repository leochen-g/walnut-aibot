import Crypto from 'crypto'
import schedule from 'node-schedule'
import fs from 'fs'

/**
 * 设置定时器
 * @param {*} date 日期
 * @param {*} callback 回调
 */
//其他规则见 https://www.npmjs.com/package/node-schedule
// 规则参数讲解    *代表通配符
//
// *  *  *  *  *  *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │ |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// 每分钟的第30秒触发： '30 * * * * *'
//
// 每小时的1分30秒触发 ：'30 1 * * * *'
//
// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
//
// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
//
// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'

function setLocalSchedule(date, callback, name) {
    if (name) {
        schedule.scheduleJob(name, {rule: date, tz: 'Asia/Shanghai'}, callback)
    } else {
        schedule.scheduleJob({rule: date, tz: 'Asia/Shanghai'}, callback)
    }
}

// 取消任务
function cancelLocalSchedule(name) {
    schedule.cancelJob(name)
}

// 取消指定任务
function cancelAllSchedule(type) {
    for (let i in schedule.scheduledJobs) {
        if (i.includes(type)) {
            cancelLocalSchedule(i)
        }
    }
}

/**
 * 获取所有定时任务的job名
 *
 */
function getAllSchedule() {
    for (let i in schedule.scheduledJobs) {
        console.log(i)
    }
}

/**
 * 延时函数
 * @param {*} ms 毫秒
 */
async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 获取周几
 * @param {*} date 日期
 */
function getDay(date) {
    var date2 = new Date()
    var date1 = new Date(date)
    var iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24)
    return iDays
}

/**
 * 格式化日期
 * @param {*} date
 * @returns 例：2019-9-10 13:13:04 星期一
 */
function formatDate(date) {
    var tempDate = new Date(date)
    var year = tempDate.getFullYear()
    var month = tempDate.getMonth() + 1
    var day = tempDate.getDate()
    var hour = tempDate.getHours()
    var min = tempDate.getMinutes()
    var second = tempDate.getSeconds()
    var week = tempDate.getDay()
    var str = ''
    if (week === 0) {
        str = '星期日'
    } else if (week === 1) {
        str = '星期一'
    } else if (week === 2) {
        str = '星期二'
    } else if (week === 3) {
        str = '星期三'
    } else if (week === 4) {
        str = '星期四'
    } else if (week === 5) {
        str = '星期五'
    } else if (week === 6) {
        str = '星期六'
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    if (min < 10) {
        min = '0' + min
    }
    if (second < 10) {
        second = '0' + second
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ' ' + str
}

/**
 * 获取今天日期
 * @returns 2019-7-19
 */
function getToday() {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + month + '-' + day + ' '
}

/**
 * 转换定时日期格式
 * @param {*} time
 * @returns 0 12 15 * * * 每天下午3点12分
 */
function convertTime(time) {
    let array = time.split(':')
    return '0 ' + array[1] + ' ' + array[0] + ' * * *'
}

//
/**
 * 判断日期时间格式是否正确
 * @param {*} str 日期
 * @returns {boolean}
 */
function isRealDate(str) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/
    var r = str.match(reg)
    if (r == null) return false
    r[2] = r[2] - 1
    var d = new Date(r[1], r[2], r[3], r[4], r[5])
    if (d.getFullYear() != r[1]) return false
    if (d.getMonth() != r[2]) return false
    if (d.getDate() != r[3]) return false
    if (d.getHours() != r[4]) return false
    if (d.getMinutes() != r[5]) return false
    return true
}

/**
 * 获取星座的英文
 * @param {*} msg
 */
function getConstellation(astro) {
    if (astro.includes('白羊座')) {
        return 'aries'
    }
    if (astro.includes('金牛座')) {
        return 'taurus'
    }
    if (astro.includes('双子座')) {
        return 'gemini'
    }
    if (astro.includes('巨蟹座') || astro.includes('钜蟹座')) {
        return 'cancer'
    }
    if (astro.includes('狮子座')) {
        return 'leo'
    }
    if (astro.includes('处女座')) {
        return 'virgo'
    }
    if (astro.includes('天平座') || astro.includes('天秤座') || astro.includes('天瓶座') || astro.includes('天枰座')) {
        return 'libra'
    }
    if (astro.includes('天蝎座')) {
        return 'scorpio'
    }
    if (astro.includes('射手座')) {
        return 'sagittarius'
    }
    if (astro.includes('射手座')) {
        return 'sagittarius'
    }
    if (astro.includes('摩羯座')) {
        return 'capricorn'
    }
    if (astro.includes('水瓶座')) {
        return 'aquarius'
    }
    if (astro.includes('双鱼座')) {
        return 'pisces'
    }
}

/**
 * 获取星座的英文
 * @param {*} msg
 */
function getNewsType(msg) {
    const NewsMap = {
        '社会': 5,
        '国内': 7,
        '国际': 8,
        '娱乐': 10,
        '美女图片': 11,
        '体育': 12,
        '科技': 13,
        '奇闻异事': 41,
        '健康知识': 17,
        '旅游': 18,
        '汉服': 38,
        '房产': 37,
        '科学探索': 36,
        '汽车': 35,
        '互联网': 34,
        '动漫': 33,
        '财经': 32,
        '游戏': 32,
        'CBA': 30,
        '人工智能': 29,
        '区块链': 28,
        '军事': 27,
        '足球': 26,
        '创业': 24,
        '移动互联': 23,
        'IT': 22,
        'VR科技': 21
    }
    return NewsMap[msg] || 7
}

/**
 * 返回指定范围的随机整数
 * @param {*} min
 * @param {*} max
 */
function randomRange(min, max) {
    // min最小值，max最大值
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 写入文件内容
 * @param fpath
 * @param encoding
 * @returns {Promise<unknown>}
 */
async function writeFile(fpath, encoding) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(fpath, encoding, function (err, content) {
            if (err) {
                reject(err)
            } else {
                resolve(content)
            }
        })
    })
}

/**
 * 解析响应数据
 * @param {*} content 内容
 */
function parseBody(content) {
    if (!content) return
    return JSON.parse(content.text)
}

/**
 * MD5加密
 * @return {string}
 */
function MD5(str) {
    return Crypto.createHash('md5').update(str).digest('hex')
}

/**
 * 对象内容按照字母排序
 * @param obj
 */
function objKeySort(obj) {
    const newkey = Object.keys(obj).sort()
    const newObj = {}
    for (let i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]]
    }
    return newObj
}

/**
 * 根据排序后的数据返回url参数
 * @param datas
 * @returns {string}
 */
function getQueryString(datas) {
    const data = objKeySort(datas)
    let url = ''
    if (typeof data === 'undefined' || data == null || typeof data !== 'object') {
        return ''
    }
    for (var k in data) {
        const string = typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k]
        url += (url.indexOf('=') !== -1 ? '&' : '') + k + '=' + string
    }
    return url
}

/**
 * 获取MD5加密后的Sign
 * @param secret
 * @param query
 * @returns {string}
 */
function getSign(secret, query) {
    const stringSignTemp = `${query}&ApiSecret=${secret}`
    return MD5(stringSignTemp).toUpperCase()
}

/**
 * 生成n位随机数
 * @param n
 * @returns {string}
 */
function rndNum(n) {
    let rnd = ''
    for (let i = 0; i < n; i++) {
        rnd += Math.floor(Math.random() * 10)
    }
    return rnd
}

/**
 * 生成加密后的对象
 * @param apiKey
 * @param apiSecret
 * @param params
 * @returns {{apiKey: *, nonce: *, timestamp: *}}
 */
function getFormatQuery(apiKey, apiSecret, params = {}) {
    const query = {
        apiKey: apiKey,
        timestamp: new Date().getTime(),
        nonce: rndNum(3),
        ...params,
    }
    const sign = getSign(getQueryString(query), apiSecret)
    query.sign = sign
    return query
}

/**
 * 生成回复内容
 * @param type 内容类型
 * @param content 内容
 * @param url 链接
 * @returns {[{type: *, content: *, url: *}]}
 */
function msgArr(type = 1, content = '', url = '', suggestions = []) {
    let obj = {type: type, content: content, url: url, suggestions}
    return [obj]
}

/**
 * 设置提醒内容解析
 * @param {*} keywordArray 分词后内容
 * @param name
 */
function contentDistinguish(keywordArray, name) {
    let scheduleObj = {}
    let today = getToday()
    scheduleObj.setter = name // 设置定时任务的用户
    scheduleObj.subscribe = keywordArray[1] === '我' ? name : keywordArray[1] // 定时任务接收者
    if (keywordArray[2] === '每天') {
        // 判断是否属于循环任务
        console.log('已设置每日定时任务')
        scheduleObj.isLoop = true
        if (keywordArray[3].includes(':') || keywordArray[3].includes('：')) {
            let time = keywordArray[3].replace('：', ':')
            scheduleObj.time = convertTime(time)
        } else {
            scheduleObj.time = ''
        }
        scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
    } else if (keywordArray[2] && keywordArray[2].includes('-')) {
        console.log('已设置指定日期时间任务')
        scheduleObj.isLoop = false
        scheduleObj.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':')
        scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
    } else {
        console.log('已设置当天任务')
        scheduleObj.isLoop = false
        scheduleObj.time = today + keywordArray[2].replace('：', ':')
        scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[3].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[3].replace('我', '你')}`
    }
    return scheduleObj
}

//过滤联系人
/**
 * @param {*} param1
 * name：名字
 * alias：别名
 * friend : 1是朋友 2不是朋友
 * type : 1个人   2 公众号  3 未知
 * gender : 1 男  2  女
 * province : 省份
 * city ：城市
 * address：地址
 */
function filterContacts(contacts, query) {
    let {name, alias, friend, type, gender, province, city, address} = query
    return contacts.filter((item) => {
        let arr = []
        let payload = item.payload || item._payload
        if (friend) {
            let bool = Number(friend) === 1 ? true : false
            arr.push(bool === payload.friend)
        }
        name && arr.push(payload.name.indexOf(name) >= 0)
        alias && arr.push(payload.alias.indexOf(alias) >= 0)
        type && arr.push(Number(type) === payload.type)
        gender && arr.push(Number(gender) === payload.gender)
        province && arr.push(payload.province.indexOf(province) >= 0)
        city && arr.push(payload.city.indexOf(city) >= 0)
        address && arr.push(payload.address.indexOf(address) >= 0)
        return arr.indexOf(false) < 0
    })
}

/**
 * 格式化联系人
 * @param {*} data
 */
function formatContacts(data) {
    let arr = data.map(function (item) {
        // const file = await item.avatar()
        // let avatar = await file.toBase64(file.name, true);
        let payload = item.payload || item._payload
        return {
            id: payload.id,
            name: payload.name,
            gender: payload.gender === 0 ? '无' : payload.gender === 1 ? '男' : '女',
            alias: payload.alias,
            friend: payload.friend ? '是' : '否',
            star: payload.star ? '是' : '否',
            type: payload.type === 1 ? '个人' : payload.type === 2 ? '公众号' : '未知',
            signature: payload.signature,
            province: payload.province,
            city: payload.city,
            address: payload.address,
        }
    })
    return arr
}

/**
 * 函数节流
 * @param fn
 * @param wait
 * @returns {Function}
 */
function throttle(fn, wait) {
    var timer = null
    return function () {
        var context = this
        var args = arguments
        if (!timer) {
            timer = setTimeout(function () {
                fn.apply(context, args)
                timer = null
            }, wait)
        }
    }
}

/**
 * @return {string}
 */
function Base64Encode(str) {
    return Buffer.from(str).toString('base64')
}

/**
 * @return {string}
 */
function Base64Decode(str) {
    return Buffer.from(str, 'base64').toString('ascii')
}

/**
 * 数组拆分
 * @param {array} array 数组
 * @param {*} subGroupLength 每个数组长度
 */
function groupArray(array, subGroupLength) {
    let index = 0
    let newArray = []
    while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
    }
    return newArray
}


export {
    Base64Encode,
    Base64Decode,
    setLocalSchedule,
    parseBody,
    delay,
    getToday,
    convertTime,
    getDay,
    formatDate,
    isRealDate,
    getConstellation,
    randomRange,
    writeFile,
    MD5,
    getFormatQuery,
    contentDistinguish,
    msgArr,
    throttle,
    formatContacts,
    filterContacts,
    cancelAllSchedule,
    getAllSchedule,
    groupArray,
    getNewsType
}

/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：public function
 */

import axios from 'axios'
import { hashHistory } from 'react-router'
import { message } from 'antd'
import qs from 'qs'

export let URL = '/mgr'
// export const site = 'http://www.huoxing24.com'
export const site = 'http://www.huoxing24.vip'

// export const URL = 'http://wechatstore.linekong.com'
export const axiosPost = (url, params, fn) => {
    let _url = URL + url
    // let _url = `/mgr${url}`
    // let _url = url
    // let _url = `/lk-mars-news${url}` // 冯阳
    axios.post(_url, params).then(function (response) {
        const data = response.data
        if (data.status === 401) {
            message.warning(data.msg)
            hashHistory.push('/login')
            // return
        } else {
            fn.call(this, data)
        }
    }).catch(function (error) {
        message.error(error)
    })
}
export const axiosAjax = (type, url, params, fn, headers) => {
    URL = url.split('/')[1] === 'passport' ? '' : '/mgr'
    let _url = URL + url
    // let _url = `/mgr${url}`
    // let _url = url
    // let _url = `/lk-mars-news${url}` // 冯阳
    let opt = {method: type, url: _url}
    if (type.toUpperCase() === 'POST') {
        opt = {...opt, data: qs.stringify(params)}
    } else {
        opt = {...opt, params: params}
    }
    if (headers) {
        opt = {...opt, data: params, headers: headers}
    }
    axios({...opt}).then(function (response) {
        const data = response.data
        if (data.status === 401) {
            message.warning(data.msg)
            hashHistory.push('/login')
            // return
        } else {
            fn.call(this, data)
        }
    }).catch(function (error) {
        message.error(error)
    })
}
export const axiosFormData = (type, url, params, fn) => {
    let _url = URL + url
    // let _url = `/mgr${url}`
    // let _url = url
    // let _url = `/lk-mars-news${url}` // 冯阳
    axios({
        method: type,
        url: _url,
        data: params,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(function (response) {
        const data = response.data
        if (data.status === 401) {
            hashHistory.push('/login')
            message.warning(data.msg)
        } else {
            fn.call(this, data)
        }
    }).catch(function (error) {
        message.error(error)
    })
}
export function getCrumbKey (location) {
    // const {location} = this.props
    let pathStr = location.pathname.substring(1)
    let arr = []
    if (pathStr.indexOf('-') !== -1) {
        let pathArr = pathStr.split('-')
        arr.push(pathArr[0])
        arr.push(pathStr)
    } else {
        arr.push(pathStr)
    }
    return arr
}

/* 时间格式化 */
export const formatDate = (val, str) => {
    if (!val) {
        return 0
    }
    let _str = !str ? '-' : str
    let _time = new Date(val)
    let y = _time.getFullYear()
    let M = _time.getMonth() + 1
    let d = _time.getDate()
    let h = _time.getHours()
    let m = _time.getMinutes()
    let s = _time.getSeconds()
    return y + _str + add0(M) + _str + add0(d) + ' ' + add0(h) + ':' + add0(m) + ':' + add0(s)
}
const add0 = (m) => {
    return m < 10 ? '0' + m : m
}

// 超出字数显示省略号
export const cutString = (str, len) => {
    // length属性读出来的汉字长度为1
    if (str && str.length) {
        if (str.length * 2 <= len) {
            return str
        }
        let strlen = 0
        let s = ''
        for (let i = 0; i < str.length; i++) {
            s = s + str.charAt(i)
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + '...'
                }
            } else {
                strlen = strlen + 1
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + '...'
                }
            }
        }
        return s
    } else {
        return ''
    }
}

// 判断是否为对象字符串
export const isJsonString = (str) => {
    try {
        if (typeof JSON.parse(str) === 'object') {
            return true
        }
    } catch (e) {
        // console.log(e)
    }
    return false
}

// 空返回展示
export const emptyOrNot = (data, value) => {
    if (data && data.trim() !== '') {
        return data
    } else {
        return !value ? '暂无' : value
    }
}

// 新闻频道
export const channelIdOptions = [
    { label: '新闻', value: '1' },
    { label: '两会', value: '10' },
    { label: '产业', value: '2' },
    { label: '项目', value: '3' },
    { label: '人物', value: '4' },
    { label: '技术', value: '6' },
    { label: '游戏', value: '7' },
    { label: '八点', value: '8' },
    { label: '王峰十问', value: '9' },
    { label: '新手入门', value: '5' },
    { label: '其他', value: '-1' }
]

// 快讯频道
export const flashIdOptions = [
    { label: '监管动态', value: '1' },
    { label: '交易所公告', value: '2' },
    { label: '重大行情', value: '3' },
    { label: '观点', value: '4' },
    { label: '暂无', value: '0' }
]

// PC 端广告位置
export const pcAdPosition = [
    { label: '首页顶部 Banner', value: '1' },
    { label: '首页中部左侧', value: '2' },
    { label: '首页中部右侧', value: '3' },
    { label: '首页底部', value: '4' },
    { label: '新闻详情顶部', value: '5' },
    { label: '新闻详情底部', value: '6' },
    { label: '相关新闻', value: '7' }
]

// 手机端广告位置
export const mobileAdPosition = [
    { label: 'Mobile首页', value: '1' },
    { label: 'Mobile新闻详情页', value: '2' }
]

// 认证状态
export const auditStatus = [
    { label: '全部', value: '' },
    { label: '认证通过', value: '1' },
    { label: '待认证', value: '0' },
    { label: '认证不通过', value: '-1' },
    { label: '未认证', value: '-2' }
]

// 认证状态
export const icoStatusOptions = [
    { label: '已结束', value: 'past' },
    { label: '进行中', value: 'ongoing' },
    { label: '即将开始', value: 'upcoming' }
]

// 直播状态
export const liveStatusOptions = [
    { label: '已结束', value: '2' },
    { label: '进行中', value: '1' },
    { label: '即将开始', value: '0' }
]

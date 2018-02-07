/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：index actions
 */

import { hashHistory } from 'react-router'
// import $ from 'jquery'
import { axiosAjax } from '../public/index'
import { message } from 'antd'

import {
    GAMELIST,
    BREADCRUMB,
    NAVIGATION
} from '../constants/index'

// 登录
export const login = (sendData) => {
    return (dispatch) => {
        $.cookie('loginStatus', true)
        hashHistory.push('/post-list')
        /*
        axiosAjax('post', '/home/login', sendData, function (data) {
            // console.log(data)
            if (data.status === 200) {
                $.cookie('loginStatus', true)
                hashHistory.push('/')
            } else {
                message.error(data.msg)
            }
        })
        */
    }
}

// 首页游戏列表
export const gameList = () => {
    return (dispatch) => {
        axiosAjax('GET', '/sysinfo/gamelist', {}, function (data) {
            if (data.status === 200) {
                const actionData = data.data
                dispatch({
                    type: GAMELIST,
                    actionData
                })
            } else {
                message.error(data.msg)
            }
        })
    }
}

export const breadcrumb = (arr) => {
    return {
        type: BREADCRUMB,
        arr
    }
}

export const navigation = (selectkey, openkey) => {
    return {
        type: NAVIGATION,
        selectkey,
        openkey
    }
}

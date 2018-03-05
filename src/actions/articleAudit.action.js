/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../public/index'
import {ARTICLEAUDIT} from '../constants/index'
import { message } from 'antd'

// 帖子列表
export const getArticleList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/news/shownews' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData, createrType: 1}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addArticleData({'list': actionData.inforList}))
                dispatch(setPageData({'totalCount': actionData.recordCount, 'pageSize': actionData.pageSize, 'currPage': actionData.currentPage}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 帖子详情
export const getArticleItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addArticleData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 回复分页
export const getArticleReplyList = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/list', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addArticleData({'replyList': actionData.datas}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 删除回复
export const delArticleReplyList = (sendData, index, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/reply/del', {...sendData, 'appId': $.cookie('gameId')}, function (res) {
            if (res.status === 200) {
                dispatch(delReplyList(index))
                if (fn) {
                    fn()
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

// 快速发帖登录
export const _login = (sendData, fn) => {
    return (dispatch) => {
        dispatch(addArticleData({'userInfo': {...sendData}}))
        if (fn) {
            fn()
        }
        /* axiosAjax('post', '/api_game_list', {...sendData}, function (res) {
            if (res.status === 200) {
                const actionData = res.data
                dispatch(addArticleData({'userInfo': {...sendData, ...actionData}}))
                if (fn) {
                    fn()
                }
                message.success('登录成功！')
            } else {
                message.error(res.msg)
            }
        }) */
    }
}

export const addArticleData = (data) => {
    return {type: ARTICLEAUDIT.ADD_DATA, data}
}

export const addArticleQuery = (data) => {
    return {type: ARTICLEAUDIT.ADD_QUERY, data}
}

export const editArticleUserInfo = (data) => {
    return {type: ARTICLEAUDIT.EDIT_USER_INFO, data}
}

export const editArticleList = (data, index) => {
    return {type: ARTICLEAUDIT.EDIT_LIST_ITEM, data, index}
}

export const delArticleData = (index) => {
    return {type: ARTICLEAUDIT.DEL_LIST_ITEM, index}
}

export const delReplyList = (index) => {
    return {type: ARTICLEAUDIT.DEL_REPLY_LIST, index}
}

export const setSearchQuery = (data) => {
    return {type: ARTICLEAUDIT.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: ARTICLEAUDIT.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: ARTICLEAUDIT.SET_PAGE_DATA, data}
}

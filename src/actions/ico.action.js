/**
 * Author：tantingting
 * Time：2017/9/26
 * Description：Description
 */

import {axiosAjax} from '../public/index'
import {ICO} from '../constants/index'
import { message } from 'antd'

// 帖子列表
export const getIcoList = (type, sendData, fn) => {
    return (dispatch) => {
        let _url = type === 'init' ? '/news/shownews' : '/post/search'
        axiosAjax('get', _url, !sendData ? {} : {...sendData, createrType: 0}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addIcoData({'list': actionData.inforList}))
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
export const getIcoItemInfo = (sendData, fn) => {
    return (dispatch) => {
        axiosAjax('post', '/news/getbyid', {...sendData}, function (res) {
            if (res.code === 1) {
                const actionData = res.obj
                dispatch(addIcoData({'info': actionData}))
                if (fn) {
                    fn(actionData)
                }
            } else {
                message.error(res.msg)
            }
        })
    }
}

export const addIcoData = (data) => {
    return {type: ICO.ADD_DATA, data}
}

export const addIcoQuery = (data) => {
    return {type: ICO.ADD_QUERY, data}
}

export const editIcoUserInfo = (data) => {
    return {type: ICO.EDIT_USER_INFO, data}
}

export const editIcoList = (data, index) => {
    return {type: ICO.EDIT_LIST_ITEM, data, index}
}

export const delIcoData = (index) => {
    return {type: ICO.DEL_LIST_ITEM, index}
}

export const setSearchQuery = (data) => {
    return {type: ICO.SET_SEARCH_QUERY, data}
}

export const setFilterData = (data) => {
    return {type: ICO.SET_FILTER_DATA, data}
}

export const setPageData = (data) => {
    return {type: ICO.SET_PAGE_DATA, data}
}

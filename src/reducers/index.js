/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root reducer
 */

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import loginInfo from './loginInfo'
import gameListInfo from './gameListInfo'
import postInfo from './post.reducer'
import commentInfo from './comment.reducer'
import flashInfo from './flash.reducer'
import userPostInfo from './userPost.reducer'
import imgsInfo from './imgs.reducer'
import languageInfo from './language.reducer'
import InitGameInfo from './initGame.reducer'
import authorityInfo from './authority.reducer'
import auditInfo from './audit.reducer'
import adInfo from './ad.reducer'
import articleAudit from './articleAudit.reducer'
import icoInfo from './ico.reducer'
import liveInfo from './live.reducer'
import liveUserInfo from './liveUser.reducer'
import liveContent from './liveContent.reducer'
const reducers = Object.assign({
    loginInfo,
    gameListInfo,
    postInfo,
    commentInfo,
    userPostInfo,
    imgsInfo,
    flashInfo,
    languageInfo,
    InitGameInfo,
    authorityInfo,
    adInfo,
    auditInfo,
    articleAudit,
    icoInfo,
    liveInfo,
    liveUserInfo,
    liveContent,
    routing: routerReducer
})

const rootReducer = combineReducers(reducers)
export default rootReducer

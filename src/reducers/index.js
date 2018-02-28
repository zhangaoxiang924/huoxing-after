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
    routing: routerReducer
})

const rootReducer = combineReducers(reducers)
export default rootReducer

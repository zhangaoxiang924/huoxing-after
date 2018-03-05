/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：root route
 */

import React from 'react'
import {Route, IndexRoute} from 'react-router'
function isLogin (nextState, replace) {
    let loginStatus = $.cookie('loginStatus')
    if (!loginStatus || !$.parseJSON(loginStatus)) {
        replace('/login')
    }
}
const rootRoutes = <div>
    <Route path="/" onEnter={isLogin} getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Main').default)
        }, 'HasHeader')
    }}>
        <IndexRoute getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.index').default)
            }, 'Enter')
        }}/>
        <Route path='/enter' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Enter').default)
            }, 'Enter')
        }}/>
        <Route path='/system' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/System/system.index').default)
            }, 'SystemIndex')
        }}/>
        <Route path='/game-init' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/GameInit/game.init').default)
            }, 'GameInit')
        }}/>
    </Route>
    <Route path="/" onEnter={isLogin} getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Main').default)
        }, 'Main')
    }}>
        <Route path='/post-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.index').default)
            }, 'PostIndex')
        }}/>
        <Route path='/post-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.detail').default)
            }, 'PostDetail')
        }}/>
        <Route path='/post-send' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Post/post.send').default)
            }, 'PostSend')
        }}/>
        {/* 快讯 */}
        <Route path='/flash-lists' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.index').default)
            }, 'FlashIndex')
        }}/>
        <Route path='/flash-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.detail').default)
            }, 'FlashDetail')
        }}/>
        <Route path='/flash-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Flash/flash.send').default)
            }, 'FlashSend')
        }}/>
        <Route path='/comment-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Comment/comment.index').default)
            }, 'CommentIndex')
        }}/>
        <Route path='/postUser' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/User/user.index').default)
            }, 'UserIndex')
        }}/>
        <Route path='/postUser-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/User/user.detail').default)
            }, 'UserDetail')
        }}/>
        <Route path='/images' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Imgs/img.index').default)
            }, 'ImgsIndex')
        }}/>
        {/* <Route path='/gameConfig' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/GameConfig/game.index').default)
            }, 'GameIndex')
        }}/> */}
        <Route path='/language' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Language/language.index').default)
            }, 'LanguageIndex')
        }}/>
        <Route path='/ad-pc' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/pcAd.index.jsx').default)
            }, 'AdIndex')
        }}/>
        <Route path='/ad-mobile' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/mobileAd.index.jsx').default)
            }, 'AdIndex')
        }}/>
        <Route path='/ad-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/pcAd.send.jsx').default)
            }, 'AdEdit')
        }}/>
        <Route path='/audit-identify' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/audit.index.jsx').default)
            }, 'AuditIndex')
        }}/>
        <Route path='/audit-details' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/audit.detail.jsx').default)
            }, 'AuditDetails')
        }}/>
        <Route path='/audit-list' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/checkArticle.index.jsx').default)
            }, 'ArticleIndex')
        }}/>
        <Route path='/checkArticle-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/checkArticle.send.jsx').default)
            }, 'ArticleSend')
        }}/>
        <Route path='/checkArticle-detail' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Audit/checkArticle.detail.jsx').default)
            }, 'ArticleDetail')
        }}/>
        <Route path='/adM-edit' getComponent={(nextState, callback) => {
            require.ensure([], (require) => {
                callback(null, require('../containers/Ad/mobileAd.send.jsx').default)
            }, 'MAdEdit')
        }}/>
    </Route>
    <Route path='/login' getComponent={(nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/Login').default)
        }, 'Login')
    }}/>
</div>

export default rootRoutes

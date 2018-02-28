/**
 * Author：zhoushuanglong
 * Time：2017/7/27
 * Description：menu data
 * , {
        key: 'postUser',
        icon: 'icon-postUser',
        link: '/postUser',
        text: '用户管理'
    }, {
        key: 'images',
        icon: 'icon-images',
        link: '/images',
        text: '图片鉴别'
    }, {
        key: 'language',
        icon: 'icon-language',
        link: '/language',
        text: '多语言词条管理'
    }
 */
const menuData = [
    {
        key: 'post',
        icon: 'icon-post',
        link: '',
        text: '新闻管理',
        children: [
            {
                key: 'post-list',
                icon: 'icon-post-list',
                link: '/post-list',
                text: '新闻列表'
            }, {
                key: 'post-send',
                icon: 'icon-post-send',
                link: '/post-send',
                text: '编辑新闻'
            }
        ]
    }, {
        key: 'flash',
        icon: 'icon-flash',
        link: '',
        text: '快讯管理',
        children: [
            {
                key: 'flash-lists',
                icon: 'icon-flash-list',
                link: '/flash-lists',
                text: '快讯列表'
            }, {
                key: 'flash-edit',
                icon: 'icon-flash-send',
                link: '/flash-edit',
                text: '编辑快讯'
            }
        ]
    }, {
        key: 'comment',
        icon: 'icon-comment',
        link: '',
        text: '评论管理',
        children: [
            {
                key: 'comment-list',
                icon: 'icon-comment-list',
                link: '/comment-list',
                text: '评论列表'
            }
        ]
    }
]
export default menuData

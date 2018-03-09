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
                text: '新闻添加/编辑'
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
                text: '快讯添加/编辑'
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
    }, {
        key: 'ad',
        icon: 'icon-ad',
        link: '',
        text: '广告管理',
        children: [
            {
                key: 'ad-pc',
                icon: 'icon-pc-list',
                link: '/ad-pc',
                text: 'PC端广告'
                // children: [
                //     {
                //         key: 'ad-pc',
                //         icon: 'icon-ad-list',
                //         link: '/ad-pc',
                //         text: 'PC端广告'
                //     }
                // ]
            },
            {
                key: 'ad-mobile',
                icon: 'icon-mobile-list',
                link: '/ad-mobile',
                text: '手机端广告'
                // children: [
                //     {
                //         key: 'ad-mobile',
                //         icon: 'icon-ad-list',
                //         link: '/ad-mobile',
                //         text: '手机端广告'
                //     }
                // ]
            }
        ]
    }, {
        key: 'audit',
        icon: 'icon-audit',
        link: '',
        text: '审核管理',
        children: [
            {
                key: 'audit-identify',
                icon: 'icon-identify',
                link: '/audit-identify',
                text: '身份认证'
            },
            {
                key: 'audit-list',
                icon: 'icon-article',
                link: '/audit-list',
                text: '文章审核'
            }
        ]
    }, {
        key: 'ico',
        icon: 'icon-ico',
        link: '',
        text: 'ICO 管理',
        children: [
            {
                key: 'ico-list',
                icon: 'icon-post-list',
                link: '/ico-list',
                text: 'ICO 列表'
            }, {
                key: 'ico-edit',
                icon: 'icon-ico-edit',
                link: '/ico-edit',
                text: 'ICO 添加/编辑'
            }
        ]
    }, {
        key: 'live',
        icon: 'icon-ico',
        link: '',
        text: '直播管理',
        children: [
            {
                key: 'live-list',
                icon: 'icon-post-list',
                link: '/live-list',
                text: '直播列表'
            }, {
                key: 'live-edit',
                icon: 'icon-ico-edit',
                link: '/live-edit',
                text: '直播添加/编辑'
            }
        ]
    }
]
export default menuData

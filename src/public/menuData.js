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
        icon: 'icon-post',
        link: '',
        text: '审核管理',
        children: [
            {
                key: 'audit-identify',
                icon: 'icon-pc-list',
                link: '/audit-identify',
                text: '身份认证'
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
                key: 'audit-list',
                icon: 'icon-mobile-list',
                link: '/audit-list',
                text: '文章审核'
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
    }
]
export default menuData

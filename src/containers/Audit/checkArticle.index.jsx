/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Input, Row, Col, Button, Table, Modal, message } from 'antd'
import { Table, Row, Col, Modal, message, Spin, Tag, Select } from 'antd'
import './checkArticle.scss'
import { Link } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getArticleList, setSearchQuery, setPageData, setFilterData} from '../../actions/articleAudit.action'
import {formatDate, axiosAjax, cutString, channelIdOptions} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class ArticleAuditIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            newsStatus: null
        }
    }

    channelName (id) {
        let name = ''
        channelIdOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch(!search.type ? 'init' : search.type, filter.status === '' ? {} : {status: filter.status})
        columns = [{
            title: '文章标题',
            width: '250px',
            key: 'name',
            render: (text, record) => (record && <div className="post-info clearfix">
                <div>
                    <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 30))} />
                    <div>
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block'}}><span className="org-bg mr10">推荐</span></div>}
                        {!parseInt(record.forbidComment) ? '' : <span className="pre-bg">禁评</span>}
                    </div>
                </div>
                {!record.pictureUrl ? '' : <img src={record.pictureUrl.split(',')[0]} />}
            </div>)
        }, {
            title: '文章状态',
            key: 'status',
            render: (record) => {
                if (record && record.status === 0) {
                    return <span className="news-status pre-publish">草稿</span>
                } else if (record && record.status === 1) {
                    return <span className="news-status has-publish">已发表</span>
                } else if (record && record.status === 2) {
                    return <span className="news-status has-forbidden">审核未通过</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '文章作者',
            dataIndex: 'author',
            key: 'author'
        }, {
            title: '文章摘要 ',
            dataIndex: 'synopsis',
            key: 'synopsis',
            render: (text, record) => (record && <span title={record.synopsis}>{cutString(record.synopsis, 25)}</span>)
        }, {
            title: '频道 ',
            dataIndex: 'channelId',
            key: 'channelId',
            render: (record) => (record && this.channelName(record))
        }, {
            title: '标签',
            dataIndex: 'tags',
            width: 200,
            key: 'tags',
            render: (record) => (record && record.split(',').map((item, index) => {
                return <Tag key={index} color="blue" style={{margin: '5px'}}>{item}</Tag>
            }))
        }, {
            title: '来源 ',
            dataIndex: 'source',
            key: 'source',
            render: (text, record) => (record && <span title={record.source}>{cutString(record.source, 30)}</span>)
        }, {
            title: '发表时间',
            key: 'createTime',
            render: (record) => (record && formatDate(record.publishTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <Link className="mr10 opt-btn" to={{pathname: '/checkArticle-detail', query: {id: item.id}}} style={{background: '#108ee9'}}>审核</Link>
                <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isTop(item)} disabled={item.status !== 1 && true}>
                    {item.recommend === 1 ? '取消推荐' : '推荐'}
                </a>
                <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                    {item.status === 1 ? '撤回到草稿箱' : '发表'}
                </a>
                {/* <a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a> */}
                <a onClick={() => this.delPost(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
    }
    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendDada = {
            status: filter.status,
            pageSize: 20,
            currentPage: pageData.currPage
            // 'appId': $.cookie('gameId')
        }
        if (type !== 'init') {
            sendDada = {
                ...sendDada,
                'nickName': search.nickName,
                'title': search.title
            }
        }
        sendDada = {...sendDada, ...data}
        // let sendDada = !data ? {searchQuery: this.state.searchQuery} : {searchQuery: this.state.searchQuery, ...data}
        dispatch(getArticleList(type, sendDada, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch, search} = this.props
        let type = 'init'
        if (!search.nickName && !search.title) {
            type = 'init'
        } else {
            type = 'search'
        }
        this.doSearch(type, {'currentPage': 1})
        dispatch(setSearchQuery({'type': type}))
        dispatch(setPageData({'currPage': 1}))
    }
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, status: filter.status})
    }
    // 删除
    delPost (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: -1
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 发表或存草稿
    _isPublish (item) {
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${item.status === 0 ? '发表' : '撤回到草稿箱'}吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: item.status === 0 ? 1 : 0
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`${item.status === 0 ? '发表' : '撤回'}成功`)
                        _this.doSearch('init')
                        dispatch(setSearchQuery({'type': 'init'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 禁评、取消禁评
    _forbidcomment (item) {
        const {dispatch} = this.props
        let sendData = {
            // 'appId': $.cookie('gameId'),
            'id': item.id,
            'operate': !parseInt(item.forbidComment) ? '1' : '0'
        }
        axiosAjax('post', '/post/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 置顶
    _isTop (item) {
        const {dispatch} = this.props
        let sendData = {
            // 'appId': $.cookie('gameId'),
            'id': item.id,
            'recommend': item.recommend === 1 ? 0 : 1
        }
        axiosAjax('post', '/news/recommend', sendData, (res) => {
            if (res.code === 1) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 筛选文章状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            newsStatus: value
        })
        this.doSearch('init', {'currentPage': 1, status: value})
    }

    render () {
        // const {list, search, pageData, dispatch} = this.props
        const {list, pageData, filter} = this.props
        return <div className="post-index">
            {/*
            <Row>
                <Col span={1} className="form-label">帖子主题:</Col>
                <Col span={3}>
                    <Input
                        value={search.title}
                        onChange={(e) => dispatch(setSearchQuery({title: e.target.value}))}
                        placeholder="请输入帖子主题"
                    />
                </Col>
                <Col span={1} className="form-label">发帖人:</Col>
                <Col span={3}>
                    <Input
                        value={search.nickName}
                        onChange={(e) => dispatch(setSearchQuery({nickName: e.target.value}))}
                        placeholder="请输入发帖人"
                    />
                </Col>
                <Col offset={1} span={2}>
                    <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                </Col>
            </Row>
            */}
            <Row>
                <Col>
                    <span>文章状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">已发表</Option>
                        <Option value="0">草稿箱</Option>
                    </Select>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        articleAudit: state.articleAudit,
        list: state.articleAudit.list,
        search: state.articleAudit.search,
        filter: state.articleAudit.filter,
        pageData: state.articleAudit.pageData
    }
}

export default connect(mapStateToProps)(ArticleAuditIndex)

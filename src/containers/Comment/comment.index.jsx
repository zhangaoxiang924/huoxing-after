/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Input, Button } from 'antd'
import './index.scss'
// import { Link } from 'react-router'
import IconItem from '../../components/icon/icon'
import {getCommentList, setSearchQuery, setPageData} from '../../actions/comment.action'
import {formatDate, axiosAjax, cutString, channelIdOptions} from '../../public/index'
const confirm = Modal.confirm
// const Option = Select.Option

let columns = []
class PostIndex extends Component {
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
        const {search} = this.props
        this.doSearch(!search.type ? 'init' : search.type, search.keys === '' ? {} : {keys: search.keys})
        columns = [{
            title: '新闻标题',
            width: '250px',
            key: 'title',
            render: (text, record) => (<div className="comment-info clearfix">
                <div className="news-link">
                        <h4 title={record.title} dangerouslySetInnerHTML={this.createMarkup(cutString(record.title, 40))} />
                    </a>
                </div>
            </div>)
        }, {
            title: '评论内容',
            key: 'content',
            width: 600,
            render: (record) => (<span title={record.content} className="reply-content">{record.content}</span>)
        }, {
            title: '昵称',
            dataIndex: 'userNickName',
            key: 'userNickName'
        }, {
            title: '评论时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                {/*
                <a className="mr10 opt-btn" style={{background: '#108ee9'}}>评论详情</a>
                */}
                <a onClick={() => this.delPost(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({keys: '', 'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'currPage': 1, 'pageSize': 20, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    doSearch (type, data) {
        const {dispatch, pageData, search} = this.props
        let sendDada = {
            // status: filter.status,
            pageSize: 20,
            currentPage: pageData.currPage
        }
        if (type !== 'init') {
            sendDada = {
                ...sendDada,
                'keys': search.keys
            }
        }
        sendDada = {...sendDada, ...data}
        // let sendDada = !data ? {searchQuery: this.state.searchQuery} : {searchQuery: this.state.searchQuery, ...data}
        dispatch(getCommentList(type, sendDada, () => {
            this.setState({
                loading: false
            })
        }))
    }
    _search () {
        const {dispatch, search} = this.props
        let type = 'init'
        if (!search.keys) {
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
        const {dispatch, search} = this.props
        // this.setState({'currPage': page})
        dispatch(setPageData({'currPage': page}))
        this.doSearch(search.type, {'currentPage': page, keys: search.keys})
    }
    // 删除
    delPost (item) {
        console.log(item)
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: 0
                }
                axiosAjax('POST', '/comment/status', {...sendData}, (res) => {
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

    render () {
        // const {list, search, pageData, dispatch} = this.props
        const {list, pageData, dispatch, search} = this.props
        return <div className="comment-index">
            <Row>
                <Col span={1} className="form-label">关键字：</Col>
                <Col span={3}>
                    <Input
                        value={search.keys}
                        onChange={(e) => dispatch(setSearchQuery({keys: e.target.value}))}
                        placeholder="请输入关键字搜索"
                    />
                </Col>
                <Col offset={1} span={2}>
                    <Button type="primary" onClick={() => { this._search() }}><IconItem type="icon-search"/>搜索</Button>
                </Col>
            </Row>
            {/*
            <Row>
                <Col>
                    <span>新闻状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        <Option value="1">已发表</Option>
                        <Option value="0">草稿箱</Option>
                    </Select>
                </Col>
            </Row>
            */}
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
        commentInfo: state.commentInfo,
        list: state.commentInfo.list,
        search: state.commentInfo.search,
        filter: state.commentInfo.filter,
        pageData: state.commentInfo.pageData
    }
}

export default connect(mapStateToProps)(PostIndex)

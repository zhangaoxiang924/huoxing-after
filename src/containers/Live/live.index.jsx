/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Input, Button } from 'antd'
import './index.scss'
import { Link, hashHistory } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getIcoList, setSearchQuery, setPageData, setFilterData} from '../../actions/live.action'
import {formatDate, axiosAjax, cutString, icoStatusOptions} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class LiveIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            icoStatus: null
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch('init', {...filter, symbol: search.symbol})
        columns = [{
            title: '直播标题',
            width: '250px',
            key: 'name',
            render: (text, record) => (record && <div className="live-info clearfix">
                <div>
                    <h4 title={record.name} dangerouslySetInnerHTML={this.createMarkup(cutString(record.name, 30))} />
                </div>
            </div>)
        }, {
            title: '嘉宾名称 ',
            dataIndex: 'symbol',
            key: 'symbol'
        }, {
            title: '主持人名称 ',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (record) => ('董卿')
        }, {
            title: '直播 ID',
            key: 'img',
            render: (record) => (123)
        }, {
            title: '直播状态',
            key: 'status',
            render: (record) => {
                if (record && record.status === 'past') {
                    return <span className="live-status pre-publish">已结束</span>
                } else if (record && record.status === 'ongoing') {
                    return <span className="live-status has-publish">进行中</span>
                } else if (record && record.status === 'upcoming') {
                    return <span className="live-status will-publish">即将开始</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '直播时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (record) => (record && formatDate(record))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <Link className="mr10 opt-btn" to={{pathname: '/live-detail', query: {id: item.id}}} style={{background: '#108ee9'}}>详情</Link>
                <a onClick={() => this.delIco(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
            </div>)
        }]
    }

    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': ''}))
        dispatch(setPageData({'pageSize': 10, 'totalCount': 0}))
    }

    createMarkup (str) { return {__html: str} }

    // 状态改变
    channelName (id) {
        let name = ''
        icoStatusOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    // 列表展示
    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendDada = {
            ...filter,
            symbol: search.symbol,
            pageSize: 10,
            page: pageData.page
        }
        sendDada = {...sendDada, ...data}
        dispatch(getIcoList(type, sendDada, () => {
            this.setState({
                loading: false
            })
        }))
    }

    // 点击搜索
    _search () {
        const {dispatch} = this.props
        this.doSearch('init', {'page': 1})
        dispatch(setPageData({'page': 1}))
    }

    // 改变页数
    changePage (page) {
        this.setState({
            loading: true
        })
        const {dispatch, search, filter} = this.props
        dispatch(setPageData({'page': page}))
        this.doSearch(search.type, {'page': page, ...filter})
    }

    // 删除
    delIco (item) {
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
                axiosAjax('POST', '/ico/delete', {...sendData}, (res) => {
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
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${item.status === 0 ? '开启直播' : '结束直播'}吗 ?`,
            onOk () {
                let sendData = {
                    id: item.id,
                    status: item.status === 0 ? 1 : 0
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`操作成功！`)
                        _this.doSearch('init')
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
        axiosAjax('post', '/ico/recommend', sendData, (res) => {
            if (res.code === 1) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 筛选直播状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({'status': value}))
        this.setState({
            icoStatus: value
        })
        this.doSearch('init', {'page': 1, status: value})
    }

    render () {
        const {list, pageData, filter, search, dispatch} = this.props
        return <div className="live-index">
            <Row>
                <Col>
                    <span>直播状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        {icoStatusOptions.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                    <span style={{marginLeft: 15}}>直播标题： </span>
                    <Input
                        value={search.symbol}
                        style={{width: 200, marginRight: 15}}
                        onChange={(e) => dispatch(setSearchQuery({symbol: e.target.value}))}
                        placeholder="请输入直播标题搜索"
                    />
                    <Button type="primary" onClick={() => { this._search() }}>搜索</Button>
                    <Button type="primary" style={{margin: '0 15px'}} onClick={() => hashHistory.push('/live-edit')}>创建直播</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.page, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        liveInfo: state.liveInfo,
        list: state.liveInfo.list,
        search: state.liveInfo.search,
        filter: state.liveInfo.filter,
        pageData: state.liveInfo.pageData
    }
}

export default connect(mapStateToProps)(LiveIndex)
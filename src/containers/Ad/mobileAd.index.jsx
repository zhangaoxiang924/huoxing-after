/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select, Button } from 'antd'
import './index.scss'
import { hashHistory, Link } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getAdList, setSearchQuery, setPageData, setFilterData, selectedData} from '../../actions/ad.action'
import {formatDate, axiosAjax, cutString, mobileAdPosition} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class mobileAdIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            adStatus: null,
            visible: false
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch(!search.type ? 'init' : search.type, {adPlace: filter.adMobilePlace})
        columns = [{
            title: '广告标题',
            width: '250px',
            key: 'remake',
            render: (text, record) => (<div className="ad-info clearfix">
                <div>
                    <h4 title={record.remake} dangerouslySetInnerHTML={this.createMarkup(record.remake ? cutString(record.remake, 30) : '暂无')} />
                    <div>
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block'}}><span className="org-bg mr10">推荐</span></div>}
                    </div>
                </div>
                {!record.pictureUrl ? '' : <img src={record.pictureUrl.split(',')[0]} />}
            </div>)
        }, {
            title: '广告状态',
            key: 'status',
            render: (record) => {
                if (record.status !== 1) {
                    return <span className="ad-status pre-publish">未展示</span>
                } else if (record.status === 1) {
                    return <span className="ad-status has-publish">展示中</span>
                } else {
                    return <span>暂无</span>
                }
            }
        }, {
            title: '广告图',
            width: 140,
            key: 'imgSrc',
            render: (record) => (<img style={{width: 100}} src={record.imgSrc} alt=""/>)
        }, {
            title: '广告位置',
            dataIndex: 'adPlace',
            key: 'adPlace',
            render: (record) => (this.adPosition(record))
        }, {
            title: '广告链接 ',
            dataIndex: 'url',
            key: 'url',
            render: (text, record) => (<a href={record.url} target='_blank' title={record.url}>{record.url ? cutString(record.url, 30) : '暂无'}</a>)
        }, {
            title: '发布时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                <a className="mr10 opt-btn" onClick={() => { this.detailModal(item) }} style={{background: '#2b465f'}}>查看</a>
                <Link className="mr10 opt-btn" to={{pathname: '/adM-edit', query: {id: item.id}}} style={{background: '#108ee9'}}>编辑</Link>
                {/* <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isTop(item)} disabled={item.status !== 1 && true}>
                    {item.recommend === 1 ? '取消推荐' : '推荐'}
                </a><a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a> */}
                <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                    {item.status === 1 ? '撤回' : '发布'}
                </a>
                <a onClick={() => this.delAd(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a>
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
        dispatch(selectedData({}))
    }
    createMarkup (str) { return {__html: str} }

    // 广告位置
    adPosition (id) {
        let name = ''
        mobileAdPosition.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendDada = {
            adPlace: filter.adMobilePlace,
            type: 2,
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
        dispatch(getAdList(type, sendDada, () => {
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
        this.doSearch(search.type, {'currentPage': page, adPlace: filter.adMobilePlace})
    }
    // 删除
    delAd (item) {
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
                axiosAjax('POST', '/ad/status', {...sendData}, (res) => {
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
            content: `确认要${item.status === 2 ? '发表' : '撤回广告'}吗 ?`,
            onOk () {
                let sendData = {
                    // 'appId': $.cookie('gameId'),
                    id: item.id,
                    status: item.status === 2 ? 1 : 2
                }
                axiosAjax('POST', '/ad/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success(`${item.status === 2 ? '发表' : '撤回'}成功`)
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
        axiosAjax('post', '/ad/forbidcomment', sendData, (res) => {
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
        axiosAjax('post', '/ad/recommend', sendData, (res) => {
            if (res.code === 1) {
                // this.doSearch(search.type)
                this.doSearch('init')
                dispatch(setSearchQuery({'type': 'init'}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 筛选广告状态
    handleChange = (value) => {
        const {dispatch} = this.props
        dispatch(setFilterData({adPlace: value}))
        this.setState({
            adStatus: value
        })
        this.doSearch('init', {'currentPage': 1, adPlace: value})
    }

    // 新增
    incAd = () => {
        hashHistory.push('/adM-edit')
    }

    // 详情弹框
    detailModal (obj) {
        this.setState({
            visible: true
        })
        const {dispatch} = this.props
        dispatch(selectedData(obj))
    }

    handleOk = (e) => {
        this.setState({
            visible: false
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false
        })
    }

    render () {
        const {list, pageData, filter, selectedData} = this.props
        return <div className="ad-index">
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
                <Col span={3}>
                    <span>广告位置：</span>
                    <Select defaultValue={`${filter.adMobilePlace}`} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="">全部</Option>
                        {mobileAdPosition.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
                </Col>
                <Col span={1} offset={1}>
                    <Button type="primary" onClick={this.incAd} className="editBtn" style={{marginRight: '10px'}}>新增广告</Button>
                </Col>
            </Row>
            <div className="mt30">
                <Spin spinning={this.state.loading} size="large">
                    <Table dataSource={list.map((item, index) => ({...item, key: index}))} columns={columns} bordered pagination={{current: pageData.currPage, total: pageData.totalCount, pageSize: pageData.pageSize, onChange: (page) => this.changePage(page)}} />
                </Spin>
            </div>
            <Modal
                title="广告详情"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div className="adInfo" style={{padding: '0 10px 10px'}}>
                    <Row>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>位置: </Col>
                        <Col span={20} className="">{this.adPosition(selectedData.adPlace)}</Col>
                    </Row>
                    <Row>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>标题: </Col>
                        <Col span={20} className="">{selectedData.remake || '无'}</Col>
                    </Row>
                    <Row>
                        <Col span={4} className="ad-title" style={{fontWeight: 'bold'}}>链接地址: </Col>
                        <Col span={20} className="">{<a target="_blank" href={selectedData.url} title={selectedData.url}>{selectedData.url || '无'}</a>}</Col>
                    </Row>
                </div>
                <Row>
                    <Col className="" style={{margin: '0 auto', width: '95%'}}><img src={selectedData.imgSrc} alt=""/></Col>
                </Row>
            </Modal>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        adInfo: state.adInfo,
        selectedData: state.adInfo.selectedData,
        list: state.adInfo.list,
        search: state.adInfo.search,
        filter: state.adInfo.filter,
        pageData: state.adInfo.pageData
    }
}

export default connect(mapStateToProps)(mobileAdIndex)

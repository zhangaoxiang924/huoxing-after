/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col, Modal, message, Spin, Select } from 'antd'
import Cookies from 'js-cookie'
import './index.scss'
import { hashHistory } from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getAuditList, setSearchQuery, setPageData, setFilterData, selectedData} from '../../actions/audit.action'
import {formatDate, axiosAjax, cutString, auditStatus} from '../../public/index'
const confirm = Modal.confirm
const Option = Select.Option

let columns = []
class AuditIndex extends Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            auditStatus: null,
            visible: false
        }
    }

    componentWillMount () {
        const {search, filter} = this.props
        this.doSearch(!search.type ? 'init' : search.type, {state: filter.status})
        columns = [{
            title: '姓名',
            key: 'identityName',
            render: (text, record) => (<div className="audit-info clearfix">
                <div>
                    <h4 title={record.identityName} dangerouslySetInnerHTML={this.createMarkup(record.identityName ? cutString(record.identityName, 30) : '暂无')} />
                    <div>
                        {!parseInt(record.recommend) ? '' : <div style={{'display': 'inline-block'}}><span className="org-bg mr10">推荐</span></div>}
                    </div>
                </div>
            </div>)
        }, {
            title: '审核状态',
            dataIndex: 'state',
            key: 'state',
            render: (text) => {
                if (text === 0) {
                    return <span className="state-btns pre-identify">{this.auditStatus(text)}</span>
                } else if (text === 1) {
                    return <span className="state-btns pass-identify">{this.auditStatus(text)}</span>
                } else if (text === -1) {
                    return <span className="state-btns cant-identify">{this.auditStatus(text)}</span>
                } else if (text === -2) {
                    return <span className="state-btns hasnot-identify">{this.auditStatus(text)}</span>
                } else {
                    return this.auditStatus(text)
                }
            }
        }, {
            title: '身份证号 ',
            dataIndex: 'identityNum',
            key: 'identityNum',
            render: (text, record) => (<h3 title={record.identityNum}>{record.identityNum ? cutString(record.identityNum, 30) : '暂无'}</h3>)
        }, {
            title: '身份证正面图',
            width: 140,
            key: 'idFaceUrl',
            render: (record) => (<img style={{width: 100}} src={record.idFaceUrl} alt=""/>)
        }, {
            title: '身份证反面图',
            width: 140,
            key: 'idBackUrl',
            render: (record) => (<img style={{width: 100}} src={record.idBackUrl} alt=""/>)
        }, {
            title: '上传时间',
            key: 'createTime',
            render: (record) => (formatDate(record.createTime))
        }, {
            title: '操作',
            key: 'action',
            render: (item) => (<div>
                {/* <a className="mr10 opt-btn" onClick={() => { this.detailModal(item) }} style={{background: '#2b465f'}}>查看</a> */}
                {item.state !== 0 ? <a
                    className="mr10 opt-btn"
                    onClick={() => { this.detailModal(item) }}
                    style={{background: '#E95D01'}}>
                    重新审核
                </a> : <a
                    className="mr10 opt-btn"
                    onClick={() => { this.detailModal(item) }}
                    style={{background: '#108ee9'}}>
                    开始审核
                </a>}
                {/* <a className={`mr10 recommend-btn opt-btn ${item.status !== 1 ? 'disabled' : ''}`} href="javascript:void(0)" onClick={() => this._isTop(item)} disabled={item.status !== 1 && true}>
                    {item.recommend === 1 ? '取消推荐' : '推荐'}
                </a><a className="mr10" href="javascript:void(0)" onClick={() => this._forbidcomment(item)}>{item.forbidComment === '1' ? '取消禁评' : '禁评'}</a> */}
                {/* <a className="mr10 opt-btn" href="javascript:void(0)" onClick={() => this._isPublish(item)} style={{background: '#00a854'}}>
                    {item.status === 1 ? '撤回' : '发布'}
                </a> */}
                {/* <a onClick={() => this.delAudit(item)} className="mr10 opt-btn" href="javascript:void(0)" style={{background: '#d73435'}}>删除</a> */}
            </div>)
        }]
    }
    componentWillUnmount () {
        const {dispatch} = this.props
        dispatch(setSearchQuery({'type': 'init', 'nickName': '', 'title': ''}))
        dispatch(setPageData({'pageSize': 20, 'totalCount': 0}))
        // dispatch(selectedData({}))
    }
    createMarkup (str) { return {__html: str} }

    // 认证状态
    auditStatus (id) {
        let name = ''
        auditStatus.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    doSearch (type, data) {
        const {dispatch, pageData, search, filter} = this.props
        let sendDada = {
            state: filter.status,
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
        dispatch(getAuditList(type, sendDada, () => {
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
        this.doSearch(search.type, {'currentPage': page, state: filter.status})
    }
    // 删除
    delAudit (item) {
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
                        message.success(`${item.status === 2 ? '发表' : '撤回到草稿箱'}成功`)
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
        dispatch(setFilterData({status: value}))
        this.setState({
            auditStatus: value
        })
        this.doSearch('init', {'currentPage': 1, state: value})
    }

    // 详情
    detailModal (obj) {
        hashHistory.push({
            pathname: '/audit-details',
            query: {id: obj.passportid}
        })
        const {dispatch} = this.props
        dispatch(selectedData(obj))
        Cookies.set('hx_identify_info', JSON.stringify(obj))
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
        return <div className="audit-index">
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
                <Col span={4} className="audit-position">
                    <span>认证状态：</span>
                    <Select defaultValue={`${filter.status}`} style={{ width: 120 }} onChange={this.handleChange}>
                        {auditStatus.map(d => <Option value={d.value} key={d.value}>{d.label}</Option>)}
                    </Select>
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
                <div className="auditInfo" style={{padding: '0 10px 10px'}}>
                    <Row>
                        <Col span={4} className="audit-title" style={{fontWeight: 'bold'}}>位置: </Col>
                        <Col span={20} className="">{this.auditStatus(selectedData.state)}</Col>
                    </Row>
                    <Row>
                        <Col span={4} className="audit-title" style={{fontWeight: 'bold'}}>标题: </Col>
                        <Col span={20} className="">{selectedData.remake || '无'}</Col>
                    </Row>
                    <Row>
                        <Col span={4} className="audit-title" style={{fontWeight: 'bold'}}>链接地址: </Col>
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
        auditInfo: state.auditInfo,
        selectedData: state.auditInfo.selectedData,
        list: state.auditInfo.list,
        search: state.auditInfo.search,
        filter: state.auditInfo.filter,
        pageData: state.auditInfo.pageData
    }
}

export default connect(mapStateToProps)(AuditIndex)

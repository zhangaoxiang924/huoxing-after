/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Row, Col, Spin, Modal, message, Form, Input, Button} from 'antd'
import PostEditor from '../../components/postEditor'
// import ModalEditor from './ModalEditor'
import {hashHistory} from 'react-router'
import {getLiveItemInfo} from '../../actions/live.action'
import {getLiveContentList, selectedData, addNewLive, delLiveItem, updateLive, setFilterData} from '../../actions/liveContent.action'
import {axiosAjax, formatDate} from '../../public/index'
import './index.scss'
const confirm = Modal.confirm
const FormItem = Form.Item

class LiveDetail extends Component {
    constructor () {
        super()
        this.state = {
            updateOrNot: false,
            visible: false,
            isEdit: false,
            loading: false,
            previewVisible: false,
            previewImage: '',
            radioValue: '',
            disabled: false,
            content: '',
            editorContent: '',
            data: {},
            contentLoading: true,
            currentPage: 1
        }
    }

    componentWillMount () {
        const {location, actions} = this.props
        actions.getLiveItemInfo({'castId': location.query.id}, (data) => {
            this.setState({
                radioValue: `${data.status}` || '0'
            })
        })
        actions.getLiveContentList('init', {
            castId: location.query.id,
            currentPage: 1,
            pageSize: 30
        }, () => {
            this.setState({
                contentLoading: false
            })
        })
    }

    // 内容格式化
    createMarkup (str) {
        return {__html: str}
    }

    onChange = (e) => {
        let value = e.target.value
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    castId: this.props.location.query.id,
                    status: value
                }
                axiosAjax('POST', '/caster/room/update/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 富文本编写
    sendPost = (sendData) => {
        let _data = {
            'content': `${sendData.postContent}` || ''
        }
        this.setState({...this.state, ..._data})
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        const {data, updateOrNot, content} = this.state
        this.props.form.setFieldsValue({
            content: content
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    disabled: true,
                    loading: true
                })
                values.castId = this.props.location.query.id || ''
                values.userId = this.props.info.presenterId

                if (updateOrNot) {
                    delete values.castId
                    values.contentId = data.contentId
                }
                !updateOrNot ? this.props.actions.addNewLive(values, (res) => {
                    if (res.code === 1) {
                        message.success('发表成功！')
                        // 清空的editor 里的内容, 待优化
                        $('.live-editor .simditor-body').html('')
                        this.setState({
                            disabled: false,
                            content: '',
                            loading: false
                        })
                    } else {
                        this.setState({
                            disabled: false,
                            loading: false
                        })
                        message.error(res.msg)
                    }
                }) : this.props.actions.updateLive(values, data.index, (res) => {
                    if (res.code === 1) {
                        // 清空的editor 里的内容, 待优化
                        $('.live-editor .simditor-body').html('')
                        this.setState({
                            disabled: false,
                            content: '',
                            loading: false
                        })
                    } else {
                        this.setState({
                            disabled: false,
                            loading: false
                        })
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 删除item
    delListItem (id, index) {
        let _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                _this.props.actions.delLiveItem({
                    contentId: id
                }, index)
            }
        })
    }

    // 编辑框文字替换
    showModal = (item, index) => {
        this.props.actions.selectedData(item)
        $('.live-editor .simditor-body').html(item.content)
        this.setState({
            updateOrNot: true,
            visible: true,
            content: item.content,
            data: {...item, index: index}
        })
    }

    // 加载更多
    loadMore = () => {
        const {location, actions, pageData} = this.props
        this.setState({
            contentLoading: true
        })
        actions.getLiveContentList('more', {
            castId: location.query.id,
            currentPage: pageData.currentPage + 1,
            pageSize: 30
        }, (data) => {
            if (data.code === 1) {
                this.setState({
                    contentLoading: false,
                    currentPage: pageData.currentPage + 1
                })
            } else {
                this.setState({
                    contentLoading: false
                })
            }
        })
    }

    changeLiveStatus = (e) => {
        let status = e.target.getAttribute('data-status')
        const {dispatch} = this.props
        const _this = this
        confirm({
            title: '提示',
            content: `确认要${status === '1' ? '结束直播' : '开始直播'}吗 ?`,
            onOk () {
                let sendData = {
                    castId: _this.props.location.query.id,
                    status: status === '1' ? '2' : '1'
                }
                axiosAjax('POST', '/caster/room/update/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        this.setState({
                            radioValue: status === '1' ? '2' : '1'
                        })
                        dispatch(setFilterData({'status': status === '1' ? '2' : '1'}))
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {contentList, pageData} = this.props
        const {content, loading, contentLoading, data, updateOrNot, radioValue} = this.state
        return <div className="live-detail-content">
            <Button type="primary" data-status={radioValue} style={{marginRight: '50px'}} onClick={this.changeLiveStatus}>{radioValue === '1' ? '结束直播' : '开始直播'}</Button>
            <div className="live-detail-section">
                <Col span={8} className="live-detail simditor">
                    <Spin spinning={contentLoading} size="large">
                        {!contentList ? <div className="tips">加载中...</div> : <div>
                            {contentList.map((item, index) => {
                                return <Row className="item-section simditor-body" key={index}>
                                    <Col className='item-content' dangerouslySetInnerHTML={this.createMarkup(item.content)}></Col>
                                    <Col span={4} className='item-opts'>
                                        <a onClick={() => { this.showModal(item, index) }}>编辑</a>
                                        <a onClick={() => { this.delListItem(item.contentId, index) }}>删除</a>
                                    </Col>
                                    <Col span={9} className='item-date'>{formatDate(item.createTime)}</Col>
                                </Row>
                            })}
                            {/*
                             <Row className="item-section">
                             <Col className='item-content'>
                             <p>好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!好了, 本次发布会到此结束, 感谢您的陪伴, 我们下期再见, 火星财经出品!</p>
                             </Col>
                             <Col className='item-img'>
                             <img src={img} alt=""/>
                             <img src={img} alt=""/>
                             <img src={img} alt=""/>
                             </Col>
                             <Col span={6} className='item-date'>{formatDate(new Date())}</Col>
                             <Col span={6} className='item-opts'>
                             <a>编辑</a>
                             <a>删除</a>
                             </Col>
                             </Row>
                             */}
                            {(() => {
                                if (contentList.length === 0) {
                                    return <div className="tips">直播好像还没开始哦~</div>
                                } else {
                                    if (this.state.currentPage >= pageData.pageCount) {
                                        return <div className="content-end">已加载全部~</div>
                                    } else {
                                        return <div className="check-more-load" onClick={this.loadMore}>查看更多</div>
                                    }
                                }
                            })()}
                        </div>}
                    </Spin>
                </Col>
                <Col span={11} offset={1} className="live-editor">
                    <Spin spinning={loading} size="large">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                label="直播内容: "
                            >
                                {getFieldDecorator('content', {
                                    initialValue: '',
                                    rules: [{required: true, message: '请输入直播内容！'}]
                                })(
                                    <Input className="news" style={{display: 'none'}}/>
                                )}
                                <PostEditor
                                    toolBar={['fontScale', 'image', 'title', 'bold', 'italic', 'underline', 'strikethrough', 'color', 'ol', 'ul', 'alignment']}
                                    info={{postContent: updateOrNot ? data.content : content}}
                                    subSend={(data) => this.sendPost(data)}
                                />
                            </FormItem>

                            <FormItem>
                                <Button
                                    disabled={this.state.disabled}
                                    type="primary" data-status='1' htmlType="submit"
                                    style={{marginRight: '10px'}}>发表</Button>
                                <Button
                                    type="primary" className="cancel"
                                    onClick={() => {
                                        hashHistory.goBack()
                                    }}>取消</Button>
                            </FormItem>
                        </Form>
                    </Spin>
                </Col>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    console.log(state.liveContent.pageData)
    return {
        info: state.liveInfo.info,
        contentList: state.liveContent.list,
        pageData: state.liveContent.pageData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getLiveContentList, getLiveItemInfo, selectedData, addNewLive, delLiveItem, updateLive}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LiveDetail))

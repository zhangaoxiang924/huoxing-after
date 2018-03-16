/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
// import {Row, Col, Button, Modal, Spin, Table} from 'antd'
// import IconItem from '../../components/icon/icon'
// import LiveEditor from './LiveEditor/index'
import {Row, Col, Spin, Modal, message, Form, Input, Button} from 'antd'
import PostEditor from '../../components/postEditor'
import {hashHistory} from 'react-router'
import {getLiveItemInfo} from '../../actions/live.action'
import {getLiveContentList, selectedData, addNewLive, delLiveItem} from '../../actions/liveContent.action'
import {axiosAjax, formatDate} from '../../public/index'
// import img from './img/default.png'
import './index.scss'
const confirm = Modal.confirm
const FormItem = Form.Item

class LiveDetail extends Component {
    constructor () {
        super()
        this.state = {
            isEdit: false,
            loading: false,
            previewVisible: false,
            previewImage: '',
            radioValue: '',
            disabled: false,
            content: '',
            contentLoading: true
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

    edit = () => {
        this.props.dispatch(selectedData(this.props.info))
        hashHistory.push({
            pathname: '/live-edit',
            query: {id: this.props.location.query.id}
        })
    }

    showModal = (src) => {
        this.setState({
            previewVisible: true,
            previewImage: src
        })
    }

    handleCancel = () => this.setState({ previewVisible: false })

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
        this.props.form.setFieldsValue({
            content: this.state.content
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    disabled: true,
                    loading: true
                })
                values.castId = this.props.location.query.id || ''
                values.userId = this.props.info.presenterId
                this.props.actions.addNewLive(values, (res) => {
                    // 清空的editor 里的内容, 待优化
                    $('.simditor-body').html('')
                    if (res.code === 1) {
                        message.success('发表成功！')
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

    render () {
        const {getFieldDecorator} = this.props.form
        const {contentList} = this.props
        const {content, loading, contentLoading} = this.state
        // const formItemLayout = {
        //     labelCol: {span: 4},
        //     wrapperCol: {span: 19, offset: 1}
        // }
        // let postInfo = {
        //     'postContent': info.content
        // }
        return <div className="live-detail-section">
            <Col span={8} className="live-detail simditor">
                <Spin spinning={contentLoading} size="large">
                    {!contentList ? <div className="tips">加载中...</div> : <div>
                        {contentList.map((item, index) => {
                            return <Row className="item-section simditor-body" key={index}>
                                <Col className='item-content' dangerouslySetInnerHTML={this.createMarkup(item.content)}></Col>
                                <Col span={4} className='item-opts'>
                                    <a>编辑</a>
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
                        {contentList.length === 0 ? <div className="tips">直播好像还没开始哦~</div> : <div className="content-end">已加载全部~</div>}
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
                                info={{'postContent': content}}
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
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.liveInfo.info,
        contentList: state.liveContent.list
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({getLiveContentList, getLiveItemInfo, addNewLive, delLiveItem}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LiveDetail))

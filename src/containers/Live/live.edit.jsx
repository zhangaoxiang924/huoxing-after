/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Row, Col, Form, Input, Upload, Icon, Modal, Button, message, Spin, DatePicker, Radio} from 'antd'
import moment from 'moment'
import {getIcoItemInfo} from '../../actions/live.action'

import {axiosPost, URL, formatDate, emptyOrNot, icoStatusOptions} from '../../public/index'
import './index.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const {TextArea} = Input

// const cateIdOptions = [
//     {label: '原创', value: '1'},
//     {label: '转载', value: '2'}
// ]

/*
 const json = {
 update: true,
 name: '作者',
 icoStatus: '0',
 cateId: '0',
 coverPic: [],
 title: '标题',
 source: 'Ico来源',
 synopsis: '摘要',
 tags: '标签',
 content: '<p>content</p>'
 }
 */

// let mp3List = []
let icoTeam = []
let icoLink = []
class LiveSend extends Component {
    state = {
        updateOrNot: false,
        isLogin: false,
        icoVisible: false,
        cateId: '1',
        previewVisible: false,
        previewImage: '',
        icoTitle: '',
        description: '',
        fileList: [],
        coverImgUrl: '',
        loading: true,
        status: 'upcoming'
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            dispatch(getIcoItemInfo({'id': location.query.id}, (data) => {
                let img = data.icoBase.img.indexOf('http') !== -1 ? data.icoBase.img : `${window.location.href.split('#')[0] + data.icoBase.img}`
                this.setState({
                    updateOrNot: true,
                    fileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: img
                    }],
                    description: data.icoBase.description,
                    coverImgUrl: img,
                    loading: false
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    cateIdChange = (e) => {
        this.setState({
            status: e.target.value
        })
    }

    // 上传图片
    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }

    handleChange = ({file, fileList}) => {
        this.setState({
            fileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                coverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    coverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    coverImgUrl: '',
                    fileList: []
                })
            }
        }
    }

    // 提交
    handleSubmit = (e) => {
        let status = e.target.getAttribute('data-status')
        e.preventDefault()

        this.props.form.setFieldsValue({
            img: this.state.coverImgUrl
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                let params = {}
                values.startTime = Date.parse(values['startTime'].format('YYYY-MM-DD HH:mm:ss'))
                values.endTime = Date.parse(values['endTime'].format('YYYY-MM-DD HH:mm:ss'))
                params.icoTeam = icoTeam
                params.icoLink = icoLink
                params.icoBase = {
                    assignment: values.assignment,
                    status: values.status,
                    chainType: values.chainType,
                    description: values.description,
                    endTime: values.endTime,
                    img: values.img,
                    jurisdiction: values.jurisdiction,
                    legalForm: values.legalForm,
                    name: values.name,
                    raised: values.raised,
                    securityAudit: values.securityAudit,
                    startTime: values.startTime,
                    supply: values.supply,
                    symbol: values.symbol
                }
                params.icoPrice = []

                for (let i = 0; i < icoTeam.length; i++) {
                    delete values[`job_${i}`]
                    delete values[`name_${i}`]
                }
                params.icoBase.id = this.props.icoInfo.icoBase.id || ''
                values.status = status || 1
                !this.state.updateOrNot && delete values.id
                !this.state.updateOrNot && delete params.icoBase.id
                console.log(params)
                axiosPost(`${this.state.updateOrNot ? '/ico/update' : '/ico/add'}`, params, (res) => {
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                        hashHistory.push('/ico-list')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    setIcoTeam (data) {
        icoTeam = data
    }

    setIcoLink (data) {
        icoLink = data
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {icoInfo} = this.props
        const {previewVisible, previewImage, fileList, updateOrNot} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 15, offset: 1}
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        const dis = { span: 6 }

        return <div className="live-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="直播标题 "
                            >
                                {getFieldDecorator('name', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.icoBase.name}` : '',
                                    rules: [{required: true, message: '请输入直播标题！'}]
                                })(
                                    <Input className="live-name" placeholder="请输入直播标题"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="直播 ID: "
                            >
                                {getFieldDecorator('symbol', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.icoBase.symbol}` : '',
                                    rules: [{required: true, message: '请输入直播 ID！'}]
                                })(
                                    <Input className="live-symbol" placeholder="请输入直播 ID"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="直播时间: "
                            >
                                {getFieldDecorator('startTime', {
                                    rules: [{required: true, message: '请选择直播开始时间！'}],
                                    initialValue: (updateOrNot && icoInfo) ? moment(formatDate(icoInfo.icoBase.startTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                                })(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem className="live-status" {...formItemLayout} label="直播状态: ">
                        {getFieldDecorator('status', {
                            initialValue: (updateOrNot && icoInfo) ? `${icoInfo.icoBase.status}` : 'upcoming'
                        })(
                            <RadioGroup
                                options={icoStatusOptions}
                                onChange={this.cateIdChange}
                                setFieldsValue={this.state.status}>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        className='inviteName'
                        {...formItemLayout}
                        label="嘉宾名称: "
                    >
                        {getFieldDecorator('raised', {
                            initialValue: (updateOrNot && icoInfo) ? `${emptyOrNot(icoInfo.icoBase.raised)}` : '',
                            rules: [{required: true, message: '请输入嘉宾名称！'}]
                        })(
                            <Input className="live-raised" placeholder="请输入嘉宾名称"/>
                        )}
                    </FormItem>
                    <FormItem
                        className="inviteInfo"
                        {...formItemLayout}
                        label="嘉宾信息: "
                    >
                        {getFieldDecorator('supply', {
                            initialValue: (updateOrNot && icoInfo) ? `${emptyOrNot(icoInfo.icoBase.supply)}` : '',
                            rules: [{required: true, message: '请输入嘉宾名称！'}]
                        })(
                            <TextArea className="live-supply" placeholder="请输入嘉宾信息"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="嘉宾头像: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('img', {
                                initialValue: (updateOrNot && icoInfo) ? fileList : '',
                                rules: [{required: true, message: '请上传嘉宾头像！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于直播页面嘉宾头像展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        className="compereName"
                        {...formItemLayout}
                        label="主持人名称: "
                    >
                        {getFieldDecorator('raised', {
                            initialValue: (updateOrNot && icoInfo) ? `${emptyOrNot(icoInfo.icoBase.raised)}` : '',
                            rules: [{required: true, message: '请输入主持人名称！'}]
                        })(
                            <Input className="live-raised" placeholder="请输入主持人名称"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="主持人头像: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('img', {
                                initialValue: (updateOrNot && icoInfo) ? fileList : '',
                                rules: [{required: true, message: '请上传主持人头像！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于直播页面主持人头像展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="直播背景图: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('img', {
                                initialValue: (updateOrNot && icoInfo) ? fileList : '',
                                rules: [{required: true, message: '请上传直播背景图！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于直播页面的背景图展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem
                        wrapperCol={{span: 12, offset: 1}}
                    >
                        <Button
                            type="primary" data-status='1' htmlType="submit"
                            style={{marginRight: '10px'}}>保存</Button>
                        <Button
                            type="primary" className="cancel"
                            onClick={() => {
                                hashHistory.goBack()
                            }}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.liveInfo.userInfo,
        liveInfo: state.liveInfo.info,
        selectData: state.liveInfo.selectedData
    }
}

export default connect(mapStateToProps)(Form.create()(LiveSend))

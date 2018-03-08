/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import {Row, Col, Form, Input, Upload, Icon, Modal, Button, message, Spin, DatePicker} from 'antd'
import moment from 'moment'
import {getIcoItemInfo} from '../../actions/ico.action'

import {axiosAjax, URL, formatDate, isJsonString} from '../../public/index'
import DynamicFieldSet from '../../components/DynamicField/index'
import './index.scss'

const FormItem = Form.Item
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
let fieldsData = []
class IcoSend extends Component {
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
        loading: true
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            dispatch(getIcoItemInfo({'id': location.query.id}, (data) => {
                let coverPic = isJsonString(data.coverPic) ? JSON.parse(data.coverPic) : {
                    pc_recommend: '',
                    pc: '',
                    wap_big: '',
                    wap_small: ''
                }
                this.setState({
                    updateOrNot: true,
                    fileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: coverPic.pc
                    }],
                    description: data.content,
                    coverImgUrl: coverPic.pc,
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
            cateId: e.target.value
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
            pc: this.state.coverImgUrl
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.startTime = Date.parse(values['startTime'].format('YYYY-MM-DD HH:mm:ss'))
                values.endTime = Date.parse(values['endTime'].format('YYYY-MM-DD HH:mm:ss'))
                values.coverPic = JSON.stringify({
                    pc_recommend: values.pc_recommend || '',
                    pc: values.pc,
                    wap_big: values.wap_big,
                    wap_small: values.wap_small
                })
                values.id = this.props.location.query.id || ''
                values.status = status || 1
                !this.state.updateOrNot && delete values.id
                axiosAjax('post', `${this.state.updateOrNot ? '/news/update' : '/news/add'}`, values, (res) => {
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

    // 发布
    sendPost = (sendData) => {
        let _data = {
            'icoTitle': sendData.postTitle || '',
            'description': `${sendData.postContent}` || ''
        }
        this.setState({...this.state, ..._data})
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    setFieldData (data) {
        fieldsData = data
    }

    render () {
        console.log(fieldsData)
        const {getFieldDecorator} = this.props.form
        const {icoInfo} = this.props
        const {previewVisible, previewImage, fileList, description, updateOrNot} = this.state
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

        return <div className="ico-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="ICO 名称: "
                            >
                                {getFieldDecorator('name', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.name}` : '',
                                    rules: [{required: true, message: '请输入名称！'}]
                                })(
                                    <Input className="ico-name" placeholder="请输入名称"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="ICO 简称: "
                            >
                                {getFieldDecorator('symbol', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.symbol}` : '',
                                    rules: [{required: true, message: '请输入Ico简称！'}]
                                })(
                                    <Input className="ico-symbol" placeholder="请输入Ico简称"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="开始时间: "
                            >
                                {getFieldDecorator('startTime', {
                                    rules: [{required: true, message: '请选择Ico开始时间！'}],
                                    initialValue: (updateOrNot && icoInfo) ? moment(formatDate(icoInfo.startTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                                })(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="结束时间: "
                            >
                                {getFieldDecorator('endTime', {
                                    rules: [{required: true, message: '请选择Ico开始时间！'}],
                                    initialValue: (updateOrNot && icoInfo) ? moment(formatDate(icoInfo.endTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                                })(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        {...formItemLayout}
                        label="ICO 图标: "
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pc', {
                                initialValue: (updateOrNot && icoInfo) ? fileList : '',
                                rules: [{required: true, message: '请上传ICO 图标！'}]
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
                            <span className="cover-img-tip">用于ICO 图标展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <Row>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="已众筹数量: "
                            >
                                {getFieldDecorator('raised', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.raised}` : '暂无'
                                })(
                                    <Input className="ico-raised" placeholder="请输入已众筹数量"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="信息总量: "
                            >
                                {getFieldDecorator('supply', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.supply}` : '暂无'
                                })(
                                    <Input className="ico-supply" placeholder="请输入信息总量"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="法律形式: "
                            >
                                {getFieldDecorator('legalForm', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.legalForm}` : '暂无'
                                })(
                                    <Input className="ico-legalForm" placeholder="请输入法律形式"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="代币平台: "
                            >
                                {getFieldDecorator('chainType', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.chainType}` : '暂无'
                                })(
                                    <Input className="ico-chainType" placeholder="请输入代币平台"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="管辖区域: "
                            >
                                {getFieldDecorator('jurisdiction', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.jurisdiction}` : '暂无'
                                })(
                                    <Input className="ico-jurisdiction" placeholder="请输入管辖区域"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="安全审计: "
                            >
                                {getFieldDecorator('securityAudit', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.securityAudit}` : '暂无'
                                })(
                                    <Input className="ico-securityAudit" placeholder="请输入安全审计"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...dis}>
                            <FormItem
                                {...formItemLayout}
                                label="ICO分配: "
                            >
                                {getFieldDecorator('assignment', {
                                    initialValue: (updateOrNot && icoInfo) ? `${icoInfo.assignment}` : '暂无'
                                })(
                                    <Input className="ico-assignment" placeholder="请输入ICO分配"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24} className="description">
                            <FormItem
                                {...formItemLayout}
                                label="ICO简介: "
                            >
                                {getFieldDecorator('description', {
                                    initialValue: (updateOrNot && icoInfo) ? description : '',
                                    rules: [{required: true, message: '请输入ICO简介！'}]
                                })(
                                    <TextArea className="description"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <DynamicFieldSet form={this.props.form} update={this.state.updateOrNot} selectGood={icoInfo} setFieldData={(data) => this.setFieldData(data)} />

                    <FormItem
                        wrapperCol={{span: 12, offset: 1}}
                    >
                        <Button
                            type="primary" data-status='1' htmlType="submit"
                            style={{marginRight: '10px'}}>发表</Button>
                        <Button
                            type="primary" data-status='0' onClick={this.handleSubmit}
                            style={{marginRight: '10px'}}>存草稿</Button>
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
        userInfo: state.icoInfo.userInfo,
        icoInfo: state.icoInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(IcoSend))

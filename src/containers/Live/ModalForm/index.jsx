import React, {Component} from 'react'
import { Modal, Form, Input, Radio, message, Icon, Upload } from 'antd'
import {URL} from '../../../public/index'
const FormItem = Form.Item

class CollectionCreateForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            updateOrNot: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            coverImgUrl: '',
            loading: true
        }
    }

    componentWillMount () {
        const {data} = this.props
        if (data) {
            let img = data.headImg
            this.setState({
                updateOrNot: true,
                fileList: [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: img
                }],
                description: data.description,
                coverImgUrl: img,
                loading: false
            })
        } else {
            this.setState({
                loading: false
            })
        }
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
                this.props.getImgData(file.response.obj)
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

    render () {
        const { visible, onCancel, onCreate, form, data } = this.props
        const { getFieldDecorator } = form
        console.log(data)
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        return (
            <Modal
                visible={visible}
                title="新增用户"
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form>
                    <FormItem label="用户名">
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入直播用户名！' }]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        className="collection-create-form_last-form-item"
                        label="用户类型"
                    >
                        {getFieldDecorator('userType', {
                            initialValue: '1'
                        })(
                            <Radio.Group>
                                <Radio value="1">嘉宾</Radio>
                                <Radio value="2">主持人</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem
                        label="用户头像"
                        className='upload-div'
                    >
                        <div className="dropbox">
                            {getFieldDecorator('headUrl', {
                                initialValue: (data && data.headUrl) ? data.headUrl : '',
                                rules: [{required: true, message: '请上传用户头像！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                >
                                    {this.state.fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={this.state.previewImage}/>
                            </Modal>
                            <span className="cover-img-tip" style={{display: 'inline-block', marginTop: '70px'}}>用于直播页面头像展示, 长宽比例: <font style={{color: 'red'}}>1 : 1</font></span>
                        </div>
                    </FormItem>
                    <FormItem label="用户描述">
                        {getFieldDecorator('description')(<Input rows={4} type="textarea" />)}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CollectionCreateForm)

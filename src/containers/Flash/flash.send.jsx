/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { hashHistory } from 'react-router'
import { Form, Radio, Input, Button, message, Spin } from 'antd'
import {getFlashItemInfo} from '../../actions/flash.action'

import {axiosAjax, flashIdOptions} from '../../public/index'
import './flash.scss'

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

/*
const json = {
    update: true,
    author: '作者',
    channelId: '0',
    cateId: '0',
    coverPic: [],
    title: '标题',
    source: '新闻来源',
    synopsis: '摘要',
    tags: '标签',
    content: '<p>content</p>'
}
*/

const tagOptions = [
    { label: '普通', value: 1 },
    { label: '重要', value: 2 }
]

class FlashSend extends Component {
    constructor () {
        super()
        this.state = {
            updateOrNot: false,
            inputVisible: false,
            channelId: '1',
            inputValue: '',
            content: '',
            loading: true,
            tag: 1,
            url: ''
        }
    }

    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            dispatch(getFlashItemInfo({'id': location.query.id}, (data) => {
                this.setState({
                    content: data.content,
                    url: data.url,
                    updateOrNot: true,
                    loading: false
                })
            }))
        } else {
            this.setState({
                loading: false
            })
        }
    }

    // 频道改变
    channelIdChange = (e) => {
        this.setState({
            channelId: e.target.value
        })
    }

    // 状态改变
    tagChange = (e) => {
        this.setState({
            tag: e.target.value
        })
    }

    // 提交
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                values.id = this.props.location.query.id || ''
                !this.state.updateOrNot && delete values.id
                axiosAjax('post', `${this.state.updateOrNot ? '/lives/update' : '/lives/add'}`, values, (res) => {
                    if (res.code === 1) {
                        message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                        hashHistory.push('/flash-lists')
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form
        const { flashInfo } = this.props
        const { content, updateOrNot, tag } = this.state
        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 15, offset: 1 }
        }

        return <div className="flash-send">
            <Spin spinning={this.state.loading} size="large">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="频道：">
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.channelId}` : '1'
                        })(
                            <RadioGroup
                                options={flashIdOptions}
                                onChange={this.channelIdChange}
                                setFieldsValue={this.state.channelId}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="快讯标识：">
                        {getFieldDecorator('tag', {
                            initialValue: (updateOrNot && flashInfo) ? flashInfo.tag : 1
                        })(
                            <RadioGroup
                                options={tagOptions}
                                onChange={this.tagChange}
                                setFieldsValue={tag}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="链接地址：">
                        {getFieldDecorator('url', {
                            initialValue: (updateOrNot && flashInfo) ? `${flashInfo.url ? flashInfo.url : ''}` : '',
                            rules: [{ type: 'url', message: '请输入正确的超链接地址！' }]
                        })(
                            <Input placeholder='快讯中插入的超链接地址'/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="内容："
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && flashInfo) ? content : '',
                            rules: [{ required: true, message: '请输入快讯内容！' }]
                        })(
                            <TextArea className="flash" placeholder="快讯内容"/>
                        )}
                    </FormItem>

                    <FormItem
                        wrapperCol={{ span: 12, offset: 2 }}
                    >
                        <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>发表</Button>
                        <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.flashInfo.userInfo,
        flashInfo: state.flashInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(FlashSend))

/**
 * Author：zhoushuanglong
 * Time：2017/7/31
 * Description：login
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { Form, Icon, Input, Button } from 'antd'
import { Form, Button } from 'antd'
import './index.scss'
import { login } from '../../actions/index'

const FormItem = Form.Item
class Login extends Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                // const form = this.props.form.getFieldsValue()
                let _data = {'email': values.email, 'password': values.password}
                this.props.actions.login(_data)
            }
        })
    }

    render () {
        // const {getFieldDecorator} = this.props.form
        return <div className="login-wrap">
            <header className="clearfix"><div className="logo">{/* <img src={logo}/> */}</div><h3>移动社区管理后台</h3></header>
            <div className="login-main">
                <div className="login-contain">
                    <div className="login-icon"></div>
                    <h3>用户登录</h3>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        {/*

                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [{required: true, message: '请输入账号'}],
                                initialValue: 'lvguowei@linekong.com'
                            })(
                                <Input prefix={
                                    <Icon type="user"/>
                                } type="text" placeholder="请输入账号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码'}],
                                initialValue: '6112LK'
                            })(
                                <Input prefix={
                                    <Icon type="lock"/>
                                } type="password" placeholder="请输入密码"/>
                            )}
                        </FormItem>
                         */}
                        <FormItem>
                            {/* <a className="login-form-forgot" href="">忘记密码</a> */}
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        loginInfo: state.loginInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({login}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login))

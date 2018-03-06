/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, message, Modal, Tag, Spin } from 'antd'
import { hashHistory } from 'react-router'
import IconItem from '../../components/icon/icon'
import {getArticleItemInfo} from '../../actions/articleAudit.action'
import {axiosAjax, channelIdOptions, isJsonString} from '../../public/index'
import './checkArticle.scss'
import '../../public/simditor.css'
const confirm = Modal.confirm

/*
const json = {
    update: true,
    author: '作者',
    channelId: '0',
    cateId: '0',
    coverPic: [],
    title: '标题',
    source: '文章来源',
    synopsis: '摘要',
    tags: '标签',
    content: '<p>content</p>'
}
*/

class ArticleAuditDetail extends Component {
    constructor () {
        super()
        this.state = {
            'isEdit': false,
            loading: true,
            previewVisible: false,
            previewImage: ''
        }
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        dispatch(getArticleItemInfo({'id': location.query.id}, () => {
            this.setState({
                loading: false
            })
        }))
    }
    // 删除
    _delPost () {
        const {location} = this.props
        // const _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let sendData = {
                    status: -1,
                    'id': location.query.id
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('删除成功')
                        hashHistory.goBack()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    // 禁评、取消禁评
    _forbidcomment (forbidcomment) {
        const {location, dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'operate': !parseInt(forbidcomment) ? '1' : '0'
        }
        axiosAjax('post', '/post/forbidcomment', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getArticleItemInfo({'id': location.query.id}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 置顶
    _isTop (istop) {
        const {location, dispatch} = this.props
        let sendData = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'operate': !parseInt(istop) ? '1' : '0'
        }
        axiosAjax('post', '/post/top', sendData, (res) => {
            if (res.status === 200) {
                // this.doSearch(this.state.type)
                dispatch(getArticleItemInfo({'id': location.query.id}))
            } else {
                message.error(res.msg)
            }
        })
    }

    // 发布
    sendPost (sendData) {
        const {location} = this.props
        let _data = {
            'appId': $.cookie('gameId'),
            'id': location.query.id,
            'title': sendData.postTitle,
            'content': `${sendData.postContent}`
        }
        console.log(_data)
        /*
        axiosAjax('post', '/post/update', _data, (res) => {
            if (res.status === 200) {
                message.success('修改成功！')
                // hashHistory.push('/post-list')
                dispatch(getArticleItemInfo({'id': location.query.id}))
                this.setState({'isEdit': false})
            } else {
                message.error(res.msg)
            }
        })
        */
    }

    // 内容格式化
    createMarkup (str) { return {__html: str} }

    channelName (id) {
        let name = ''
        channelIdOptions.map((item, index) => {
            if (parseInt(item.value) === id) {
                name = item.label
            }
        })
        return name
    }

    edit = () => {
        const {info} = this.props
        hashHistory.push({
            pathname: '/checkArticle-edit',
            query: {id: info.id}
        })
        sessionStorage.setItem('hx_content', JSON.stringify(info))
    }

    // 上传图片
    handleCancel = () => this.setState({ previewVisible: false })

    showModal = (src) => {
        this.setState({
            previewVisible: true,
            previewImage: src
        })
    }

    handleSubmit = (e) => {
        let status = e.target.getAttribute('data-status')
        let statusText = '审核通过'
        switch (status) {
            case '1':
                statusText = '审核通过并发表'
                break
            case '0':
                statusText = '暂存草稿箱'
                break
            case '2':
                statusText = '不通过审核'
                break
            default:
                statusText = '审核通过'
                break
        }

        e.preventDefault()
        const {info} = this.props
        confirm({
            title: '提示',
            content: `确认要${statusText}吗 ?`,
            onOk () {
                let sendData = {
                    id: info.id,
                    status: status
                }
                axiosAjax('POST', '/news/status', {...sendData}, (res) => {
                    if (res.code === 1) {
                        message.success('操作成功')
                        hashHistory.goBack()
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })
    }

    render () {
        const col = {
            span: 5,
            offset: 1
        }
        const {info} = this.props
        return <Spin spinning={this.state.loading} size="large">
            {info.id ? <div className="post-detail">
                <Row>
                    <Col span={1}>
                        <Button shape="circle" icon="arrow-left" onClick={() => hashHistory.goBack()} />
                    </Col>
                    <Col className="text-right" span={20} offset={3}>
                        <Button onClick={this.edit} className="mr10" type="primary" ><IconItem type="icon-edit"/>编辑</Button>
                        {/*
                        <Button onClick={() => this._isTop(info.isTop)} className="mr10"><IconItem type={info.isTop === '1' ? 'icon-cancel-top' : 'icon-to-top'}/>{info.isTop === '1' ? '取消置顶' : '置顶'}</Button>
                        <Button onClick={() => this._forbidcomment(info.forbidComment)} className="mr10"><IconItem type={info.forbidComment === '1' ? 'icon-msg' : 'icon-no-msg'}/>{info.forbidComment === '1' ? '取消禁评' : '禁评'}</Button>
                        */}
                        <Button onClick={() => this._delPost()}><IconItem type="icon-clear"/>删除</Button>
                    </Col>
                </Row>
                <Row className="news-detail-info">
                    <Col className="section" span={3} offset={1}>
                        <span className="name">作者：</span>
                        <span className="desc">{`${info.author || '无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">文章来源：</span>
                        <span className="desc">{`${info.source || '无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">频道：</span>
                        <span className="desc">{`${this.channelName(info.channelId) || '无'}`} </span>
                    </Col>
                    <Col className="section" {...col}>
                        <span className="name">类别：</span>
                        <span className="desc">{`${info.cateId === 1 ? '原创' : '转载'}`} </span>
                    </Col>
                </Row>
                <Row className="news-tags">
                    <Col className="section">
                        <span className="name">标签：</span>
                        {info.tags && info.tags !== '' ? info.tags.split(',').map((item, index) => {
                            return <Tag key={index} color="blue" style={{marginLeft: 5}}>{item}</Tag>
                        }) : '无'}
                    </Col>
                </Row>
                <Row className="news-title">
                    <Col className="section">
                        <span className="name">文章标题：</span>
                        <span className="desc">{`${info.title}`} </span>
                    </Col>
                </Row>
                <Row className="news-summary">
                    <Col className="section">
                        <span className="name">文章摘要：</span>
                        <span className="desc">{`${info.synopsis}`} </span>
                    </Col>
                </Row>
                {isJsonString(info.coverPic) ? <div>
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name">PC-文章封面：</span>
                            <img className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).pc)} src={`${JSON.parse(info.coverPic).pc}`}/>
                        </Col>
                    </Row>
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name">PC-推荐位封面：</span>
                            {(JSON.parse(info.coverPic).pc_recommend && JSON.parse(info.coverPic).pc_recommend !== '') ? <img
                                className="desc"
                                onClick={() => this.showModal(JSON.parse(info.coverPic).pc_recommend)}
                                src={`${JSON.parse(info.coverPic).pc_recommend}`}/> : <span style={{padding: 6}}>暂无推荐位封面</span>
                            }
                        </Col>
                    </Row>
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name" style={{width: '125px', verticalAlign: 'top'}}>M-文章封面：</span>
                            <img className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).wap_small)} style={{width: 95, border: '1px solid #eee'}} src={`${JSON.parse(info.coverPic).wap_small}`}/>
                        </Col>
                    </Row>
                    <Row className="news-cover-img">
                        <Col className="section">
                            <span className="name" style={{width: '125px', verticalAlign: 'top'}}>M-推荐：</span>
                            <img className="desc" onClick={() => this.showModal(JSON.parse(info.coverPic).wap_big)} style={{width: 95, border: '1px solid #eee'}} src={`${JSON.parse(info.coverPic).wap_big}`}/>
                        </Col>
                    </Row>
                </div> : <Row className="news-cover-img">
                    <Col className="section">
                        <span className="name">文章封面：</span>
                        <span style={{paddingTop: '6px'}}>暂无</span>
                    </Col>
                </Row>}

                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                {/* 帖子内容 */}
                <Row>
                    <Col style={{fontSize: '15px', fontWeight: 'bolder', padding: '5px', color: '#000'}}>文章内容: </Col>
                    <Col className="page-box post-content simditor">
                        <div className="post-main simditor-body">
                            <div className="content-text" dangerouslySetInnerHTML={this.createMarkup(info.content)} />
                        </div>
                    </Col>
                </Row>
                <div className="btns" style={{margin: '20px 0'}}>
                    <Button type="primary" data-status='1' onClick={this.handleSubmit} style={{marginRight: '10px'}}>审核通过并发表</Button>
                    <Button type="primary" data-status='0' onClick={this.handleSubmit} style={{marginRight: '10px'}}>暂存为草稿</Button>
                    <Button type="primary" data-status='2' onClick={this.handleSubmit} style={{marginRight: '10px'}}>审核不通过</Button>
                    <Button type="primary" className="cancel" onClick={() => { hashHistory.goBack() }}>取消</Button>
                </div>
            </div> : <div style={{height: 300}}>加载中...</div>}
        </Spin>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.articleAudit.info
    }
}

export default connect(mapStateToProps)(ArticleAuditDetail)

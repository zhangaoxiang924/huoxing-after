/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Pagination, Modal } from 'antd'
// import defaultImg from './img/default.png'
import IconItem from '../../components/icon/icon'
import {getPostReplyList, delPostReplyList} from '../../actions/post.action'
import {formatDate} from '../../public/index'
import './post.scss'
const confirm = Modal.confirm
class PostDetailReply extends Component {
    constructor () {
        super()
        this.state = {
            'currPage': 1,
            'pageSize': 10,
            'totalCount': 0
        }
    }
    componentWillMount () {
        this.getList()
    }

    getList (obj) {
        const {dispatch, postId} = this.props
        dispatch(getPostReplyList({'postsId': postId, 'page': this.state.currPage, ...obj}, (resData) => {
            this.setState({'totalCount': resData.totalCount, 'pageSize': resData.pageSize})
        }))
    }

    delList (postId, replyId, index) {
        let _this = this
        confirm({
            title: '提示',
            content: `确认要删除吗 ?`,
            onOk () {
                let _data = {
                    'replyId': replyId,
                    'postsId': postId
                }
                _this.props.dispatch(delPostReplyList(_data, index))
            }
        })
    }

    changePage (page) {
        this.setState({'currPage': page})
        this.getList({'page': page})
    }

    createMarkup (str) { return {__html: str} }

    render () {
        const {currPage, pageSize, totalCount} = this.state
        const {replyList} = this.props
        return <div style={{'display': !replyList.length ? 'none' : 'block'}} className="page-box user-content">
            {
                replyList.map((item, index) => (
                    <div key={index} className="item">
                        <div className="num-tip">{(currPage - 1) * pageSize + index + 2}F</div>
                        <Row>
                            <Col span={22}>
                                <div className="user-info">
                                    <div className="img-box"><img src={!item.length ? '' : item[item.length - 1].userIcon} /></div>
                                    <div>
                                        <div className="mb5">{!item.length ? '' : item[item.length - 1].nickName}</div>
                                        <div>{formatDate(!item.length ? '' : item[item.length - 1].replyTime)}</div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="text-right" span={2}>
                                <Button onClick={() => this.delList(!item.length ? '' : item[item.length - 1].postsId, !item.length ? '' : item[item.length - 1].replyId, index)}><IconItem type="icon-clear"/>删除</Button>
                            </Col>
                        </Row>
                        <div>
                            {
                                !item.length || item.length < 2 ? ''
                                    : <div className="first-reply">
                                        <span>引用：{item[0].nickName}&nbsp;&nbsp;发表于&nbsp;&nbsp;{formatDate(item[0].replyTime)}</span>
                                        <p className="content-text" dangerouslySetInnerHTML={this.createMarkup(item[0].replyContent)} />
                                    </div>
                            }
                            <p className="content-text" dangerouslySetInnerHTML={this.createMarkup(!item.length ? '' : item[item.length - 1].replyContent)} />
                            <div className="img-content">
                                {
                                    !item.length || !item[item.length - 1].pictureUrl ? '' : item[item.length - 1].pictureUrl.split(',').map((img, i) => (
                                        <img key={i} className="mr10" src={img}/>
                                    ))
                                }
                            </div>
                        </div>
                        {/* <p>
                            {!item.length ? '' : item[item.length - 1].replyContent}
                        </p> */}
                    </div>
                ))
            }
            {/* <div className="item">
                <div className="num-tip">3F</div>
                <Row>
                    <Col span={22}>
                        <div className="user-info">
                            <div className="img-box"><img src="" /></div>
                            <div>
                                <div className="mb5">用户名称</div>
                                <div>2017-07-26  12：00：00</div>
                            </div>
                        </div>
                    </Col>
                    <Col className="text-right" span={2}>
                        <Button><IconItem type="icon-clear"/>删除</Button>
                    </Col>
                </Row>
                <div>
                    <div className="first-reply">
                        <span>引用：wccnm888&nbsp;&nbsp;发表于&nbsp;&nbsp;2017-7-31 18：20</span>
                        <p>
                            帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                            帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                            帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                        </p>
                    </div>
                    <p className="content-text">
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容
                        帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子内容帖子
                    </p>
                </div>
            </div> */}
            {/* 分页 */}
            <div className="pagination">
                {!totalCount ? '' : <Pagination onChange={(page) => this.changePage(page)} current={currPage} total={totalCount} pageSize={pageSize} />}
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        replyList: state.postInfo.replyList
    }
}

export default connect(mapStateToProps)(PostDetailReply)

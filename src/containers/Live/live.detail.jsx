/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {Row, Col, Button, Modal, Spin, Table} from 'antd'
import {Spin} from 'antd'
import LiveEditor from './LiveEditor/index'
import ShowContent from './ShowContent/index'
import {hashHistory} from 'react-router'
// import IconItem from '../../components/icon/icon'
import {getIcoItemInfo, selectedData} from '../../actions/live.action'
// import {formatDate} from '../../public/index'
import './index.scss'

// const confirm = Modal.confirm

class LiveDetail extends Component {
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
        dispatch(getIcoItemInfo({'id': location.query.id}, () => {
            this.setState({
                loading: false
            })
        }))
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

    render () {
        // const col = {
        //     span: 5,
        //     offset: 1
        // }
        return <Spin spinning={this.state.loading} size="large">
            <LiveEditor />
            <ShowContent />
            {/* <div style={{height: 300}}>加载中...</div> */}
        </Spin>
    }
}

const mapStateToProps = (state) => {
    return {
        info: state.liveInfo.info,
        liveBase: state.liveInfo.info.liveBase,
        liveLink: state.liveInfo.info.liveLink,
        liveTeam: state.liveInfo.info.liveTeam
    }
}

export default connect(mapStateToProps)(LiveDetail)

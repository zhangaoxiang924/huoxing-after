/**
 * Author：tantingting
 * Time：2017/9/19
 * Description：Description
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import PostEditor from '../../components/postEditor'
import {Radio, Form, Input, Upload, Icon, Modal, Button, Tag, Tooltip, message, Row, Col, Spin, DatePicker, Progress} from 'antd'
import moment from 'moment'
import {getPostItemInfo} from '../../actions/post.action'

import {axiosFormData, axiosAjax, URL, formatDate, channelIdOptions, isJsonString} from '../../public/index'
import './post.scss'

const FormItem = Form.Item
const {TextArea} = Input
const RadioGroup = Radio.Group

const cateIdOptions = [
    {label: '原创', value: '1'},
    {label: '转载', value: '2'}
]

let uploadId = ''
let currIndex = 1
let pause = false
class PostSend extends Component {
    state = {
        updateOrNot: false,
        tags: ['区块链'],
        inputVisible: false,
        inputValue: '',
        isLogin: false,
        channelId: '1',
        newsVisible: false,
        cateId: '1',
        previewVisible: false,
        previewImage: '',
        newsTitle: '',
        newsContent: '',
        videoPcfileList: [],
        videoMfileList: [],
        fileList: [],
        pcfileList: [],
        mfileList: [],
        mcfileList: [],
        mp3fileList: [],
        videofileList: [],
        videoList: [],
        audioDefalutArr: [],
        videoDefalutArr: [],
        videoPccoverImgUrl: '',
        videoMcoverImgUrl: '',
        coverImgUrl: '',
        pccoverImgUrl: '',
        mcoverImgUrl: '',
        mccoverImgUrl: '',
        mp3Url: '',
        videoUrl: '',
        uploading: false,
        progressNum: 0,
        loading: true
    }
    componentWillMount () {
        const {dispatch, location} = this.props
        if (location.query.id) {
            dispatch(getPostItemInfo({'id': location.query.id}, (data) => {
                let coverPic = isJsonString(data.coverPic) ? JSON.parse(data.coverPic) : {
                    pc_recommend: '',
                    pc: '',
                    wap_big: '',
                    wap_small: '',
                    video_pc: '',
                    video_m: ''
                }
                let pcfileList = (coverPic.pc_recommend && coverPic.pc_recommend !== '') ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: coverPic.pc_recommend
                }] : []
                let videoPcfileList = (coverPic.video_pc && coverPic.video_pc !== '') ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: coverPic.video_pc
                }] : []
                let videoMfileList = (coverPic.video_m && coverPic.video_m !== '') ? [{
                    uid: 0,
                    name: 'xxx.png',
                    status: 'done',
                    url: coverPic.video_m
                }] : []
                this.setState({
                    updateOrNot: true,
                    videoPcfileList: videoPcfileList,
                    videoMfileList: videoMfileList,
                    fileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: coverPic.pc
                    }],
                    pcfileList: pcfileList,
                    mfileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: coverPic.wap_small
                    }],
                    mcfileList: [{
                        uid: 0,
                        name: 'xxx.png',
                        status: 'done',
                        url: coverPic.wap_big
                    }],
                    audioDefalutArr: isJsonString(data.audio) ? JSON.parse(data.audio) : [],
                    videofileList: isJsonString(data.video) ? JSON.parse(data.video) : [],
                    tags: data.tags.split(','),
                    newsContent: data.content,
                    coverImgUrl: coverPic.pc,
                    pccoverImgUrl: coverPic.pc_recommend || '',
                    mcoverImgUrl: coverPic.wap_small,
                    mccoverImgUrl: coverPic.wap_big,
                    videoMcoverImgUrl: coverPic.video_m,
                    videoPccoverImgUrl: coverPic.video_pc,
                    mp3Url: data.audio,
                    videoUrl: data.video,
                    loading: false
                })
            }))
        } else {
            this.setState({
                loading: false
            })
            sessionStorage.setItem('hx_content', '')
        }
    }

    componentDidMount () {
        this.authorInput.focus()
    }

    // 频道改变
    channelIdChange = (e) => {
        this.setState({
            channelId: e.target.value
        })
    }

    cateIdChange = (e) => {
        this.setState({
            cateId: e.target.value
        })
    }

    // 标签设置
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag)
        this.setState({tags})
    }

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus())
    }

    handleInputChange = (e) => {
        this.setState({inputValue: e.target.value})
    }

    handleInputConfirm = () => {
        const state = this.state
        const inputValue = state.inputValue
        let tags = state.tags
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue.slice(0, 8)]
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: ''
        })
    }

    saveInputRef = (input) => {
        this.input = input
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

    handleVideoPcChange = ({file, fileList}) => {
        this.setState({
            videoPcfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                videoPccoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    videoPccoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    videoPccoverImgUrl: '',
                    videoPcfileList: []
                })
            }
        }
    }

    handleVideoMChange = ({file, fileList}) => {
        this.setState({
            videoMfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                videoMcoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    videoMcoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    videoMcoverImgUrl: '',
                    videoMfileList: []
                })
            }
        }
    }

    handlePcChange = ({file, fileList}) => {
        this.setState({
            pcfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                pccoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    pccoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    pccoverImgUrl: '',
                    pcfileList: []
                })
            }
        }
    }

    handleMobileChange = ({file, fileList}) => {
        this.setState({
            mfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mcoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mcoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mcoverImgUrl: '',
                    mfileList: []
                })
            }
        }
    }

    handleMobileCommentChange = ({file, fileList}) => {
        this.setState({
            mcfileList: fileList
        })

        if (file.status === 'removed') {
            this.setState({
                mccoverImgUrl: ''
            })
        }

        if (file.response) {
            if (file.response.code === 1 && file.status === 'done') {
                this.setState({
                    mccoverImgUrl: file.response.obj
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
                this.setState({
                    mccoverImgUrl: '',
                    mcfileList: []
                })
            }
        }
    }

    handleMp3 = ({file, fileList}) => {
        if (file.response) {
            if (file.response.code === 1) {
                this.setState({
                    mp3fileList: fileList
                }, function () {
                })
            }
            if (file.status === 'error') {
                message.error('网络错误，上传失败！')
            }
        }
    }

    // 大文件上传
    handleUpload = () => {
        const { videoList } = this.state
        let file = videoList[0]
        let totalSize = file.size // 文件大小
        let blockSize = 1024 * 1024 * 2 // 块大小
        let blockCount = Math.ceil(totalSize / blockSize) // 总块数
        // 创建FormData对象
        let formData = new FormData()
        formData.append('fileName', file.name) // 文件名
        formData.append('blockCount', blockCount) // 总块数
        formData.append('currIndex', currIndex) // 当前上传的块下标
        formData.append('uploadId', uploadId) // 上传编号
        formData.append('uploadFile', null)
        formData.append('type', 'video')
        this.setState({
            uploading: true
        })
        this.UploadPost(file, formData, totalSize, blockCount, blockSize)
    }

    UploadPost = (file, formData, totalSize, blockCount, blockSize) => {
        if (pause) {
            return // 暂停
        }
        try {
            let start = (currIndex - 1) * blockSize
            let end = Math.min(totalSize, start + blockSize)
            let uploadFile = file.slice(start, end)
            formData.set('uploadFile', uploadFile)
            formData.set('currIndex', currIndex)
            formData.set('uploadId', uploadId)

            axiosFormData('post', '/file/upload', formData, (res) => {
                if (res.code === 1) {
                    if (currIndex === 1) {
                        uploadId = res.obj
                    }
                    let num = currIndex / blockCount * 100
                    if ((currIndex + 1) === blockCount) {
                        num = 100
                    }
                    this.setState({
                        progressNum: parseFloat(num.toFixed(2))
                    })
                    if (currIndex < blockCount) {
                        currIndex = currIndex + 1
                        this.UploadPost(file, formData, totalSize, blockCount, blockSize)
                    }
                } else if (res.code < 0) {
                    message.error(res.msg)
                } else if (res.code === 2) {
                    let {videofileList} = this.state
                    let newVideoFile = []
                    videofileList.map((item, index) => {
                        newVideoFile.push({
                            uid: item.uid,
                            fileName: item.name,
                            name: item.name,
                            fileUrl: res.obj
                        })
                    })
                    this.setState({
                        videoList: [],
                        videofileList: newVideoFile,
                        uploading: false
                    })
                    message.success('文件上传成功!')
                    console.log('code:' + res.code + ' msg:' + res.msg + ' url:' + res.obj)
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    newsVisibleHide = () => {
        this.setState({newsVisible: false})
    }

    newsVisibleShow = () => {
        this.setState({newsVisible: true})
    }

    // 音频
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    // 视频
    videoNormFile = (e) => {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    delAudio = (uid) => {
        let arr = this.state.audioDefalutArr
        arr.map(function (item, index) {
            if (item.uid.toString() === uid.toString()) {
                arr.splice(index, 1)
            }
        })
        this.setState({
            audioDefalutArr: arr
        })
    }

    delVideo = () => {
        // let arr = this.state.videofileList
        this.setState({
            videofileList: []
        })
    }

    // 提交
    handleSubmit = (e) => {
        if (this.state.uploading) {
            message.warning('视频正在上传, 请稍候提交!')
            return false
        }
        let status = e.target.getAttribute('data-status')
        e.preventDefault()

        let newArr = this.state.audioDefalutArr
        this.state.mp3fileList.map(function (item, index) {
            newArr.push({
                uid: item.uid,
                fileName: item.name,
                fileUrl: item.response.obj
            })
        })
        this.setState({
            audioDefalutArr: newArr
        }, function () {
            this.props.form.setFieldsValue({
                tags: this.state.tags.join(','),
                content: this.state.newsContent,
                pc_recommend: this.state.pccoverImgUrl,
                pc: this.state.coverImgUrl,
                wap_small: this.state.mcoverImgUrl,
                wap_big: this.state.mccoverImgUrl,
                video_pc: this.state.videoPccoverImgUrl,
                video_m: this.state.videoMcoverImgUrl,
                audio: JSON.stringify(this.state.audioDefalutArr),
                video: this.state.videofileList[0] && this.state.videofileList[0].fileUrl ? JSON.stringify(this.state.videofileList) : '[]'
            })
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    this.setState({
                        loading: true
                    })
                    values.publishTime = Date.parse(values['publishTime'].format('YYYY-MM-DD HH:mm:ss'))
                    values.coverPic = JSON.stringify({
                        pc_recommend: values.pc_recommend || '',
                        pc: values.pc,
                        wap_big: values.wap_big,
                        wap_small: values.wap_small,
                        video_pc: this.state.videoPccoverImgUrl,
                        video_m: this.state.videoMcoverImgUrl
                    })
                    delete values.pc
                    delete values.pc_recommend
                    delete values.wap_big
                    delete values.wap_small
                    delete values.video_pc
                    delete values.video_m
                    values.id = this.props.location.query.id || ''
                    values.status = status || 1
                    !this.state.updateOrNot && delete values.id
                    axiosAjax('post', `${this.state.updateOrNot ? '/news/update' : '/news/add'}`, values, (res) => {
                        if (res.code === 1) {
                            message.success(this.state.updateOrNot ? '修改成功！' : '添加成功！')
                            hashHistory.push('/post-list')
                        } else {
                            message.error(res.msg)
                        }
                    })
                }
            })
        })
    }

    // 发布
    sendPost = (sendData) => {
        let _data = {
            'newsTitle': sendData.postTitle || '',
            'newsContent': `${sendData.postContent}` || ''
        }
        this.setState({...this.state, ..._data})
    }

    // 内容格式化
    createMarkup = (str) => {
        return {__html: str}
    }

    render () {
        const This = this
        const {getFieldDecorator} = this.props.form
        const {newsInfo, location} = this.props
        const {progressNum, videoPcfileList, videoMfileList, videofileList, uploading, previewVisible, previewImage, fileList, pcfileList, mfileList, mcfileList, tags, inputVisible, inputValue, newsContent, updateOrNot, newsVisible, mp3fileList} = this.state
        const formItemLayout = {
            labelCol: {span: 1},
            wrapperCol: {span: 15, offset: 1}
        }
        const props = {
            action: '/file/upload',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file)
                    const newFileList = fileList.slice()
                    newFileList.splice(index, 1)
                    return {
                        videoList: newFileList,
                        videofileList: newFileList
                    }
                })
            },
            beforeUpload: (file) => {
                this.setState({
                    videoList: [file],
                    videofileList: [file]
                })
                return false
            },
            fileList: this.state.videofileList
        }
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        // 获取内容并显示, 暂时这么写
        const hxContent = location.query.id ? JSON.parse(sessionStorage.getItem('hx_content')).content : ''

        return <div className="post-send">
            <Spin spinning={this.state.loading} size='large'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="作者: "
                    >
                        {getFieldDecorator('author', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.author}` : '',
                            rules: [{required: true, message: '请输入作者！'}]
                        })(
                            <Input ref={(input) => { this.authorInput = input }} className="news-author" placeholder="请输入作者"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="来源: "
                    >
                        {getFieldDecorator('source', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.source}` : '',
                            rules: [{required: true, message: '请输入新闻来源！'}]
                        })(
                            <Input className="news-source" placeholder="请输入新闻来源"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="频道: ">
                        {getFieldDecorator('channelId', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.channelId}` : '1'
                        })(
                            <RadioGroup
                                options={channelIdOptions}
                                onChange={this.channelIdChange}
                                setFieldsValue={this.state.channelId}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="类别: ">
                        {getFieldDecorator('cateId', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.cateId}` : '1'
                        })(
                            <RadioGroup
                                options={cateIdOptions}
                                onChange={this.cateIdChange}
                                setFieldsValue={this.state.cateId}>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="发布日期: "
                    >
                        {getFieldDecorator('publishTime', {
                            rules: [{required: true, message: '请选择新闻发布时间！'}],
                            initialValue: (updateOrNot && newsInfo) ? moment(formatDate(newsInfo.publishTime), 'YYYY-MM-DD HH:mm:ss') : moment()
                        })(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="热度: "
                    >
                        {getFieldDecorator('hotCounts', {
                            initialValue: (updateOrNot && newsInfo) ? newsInfo.hotCounts : 0,
                            rules: [{required: true, pattern: /^[0-9]+$/, message: '请输入新闻热度值(正整数)！'}]
                        })(
                            <Input className="news-source" placeholder="请输入新闻热度值"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="标题: ">
                        {getFieldDecorator('title', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.title}` : '',
                            rules: [{required: true, message: '请输入新闻标题！'}]
                        })(
                            <Input placeholder="新闻标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="音频">
                        {getFieldDecorator('audio', {
                            valuePropName: 'mp3fileList',
                            getValueFromEvent: this.normFile
                        })(
                            <Upload
                                defaultFileList={this.state.mp3fileList}
                                action={`${URL}/audio/upload`}
                                name='uploadFile'
                                filelist={mp3fileList}
                                onChange={this.handleMp3}>
                                <Button>
                                    <Icon type="upload"/> 点击上传音频
                                </Button>
                            </Upload>
                        )}
                        <ul>{this.state.audioDefalutArr.map(function (item, index) {
                            return <li key={index}>
                                {item.fileName}
                                <span style={{marginLeft: '10px', cursor: 'pointer'}} onClick={() => {
                                    This.delAudio(item.uid)
                                }}>删除</span>
                                {/* <audio src={item.fileUrl}/> */}
                            </li>
                        })}</ul>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="视频">
                        {getFieldDecorator('video')(
                            <Upload
                                {...props}
                                name='uploadFile'
                            >
                                <Button>
                                    <Icon type="upload"/> 选择视频
                                </Button>
                            </Upload>
                        )}
                        {(() => {
                            if (videofileList.length === 0) {
                                return ''
                            } else if (videofileList[0].fileName) {
                                return <p>
                                    <span>{videofileList[0].fileName}</span>
                                    <span onClick={this.delVideo} style={{marginLeft: 15, color: '#52b8fc', cursor: 'pointer'}}>删除</span>
                                </p>
                            }
                        })()}
                        <Button
                            style={{marginTop: 16}}
                            className="upload-demo-start"
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={this.state.videoList.length === 0}
                            loading={uploading}
                        >
                            {uploading ? '上传中' : '开始上传' }
                        </Button>
                        {uploading && <Progress strokeWidth={5} style={{width: 300, display: 'block'}} percent={progressNum} status="active" />}
                    </FormItem>

                    {(videofileList[0] && videofileList[0].fileUrl) ? <div className="video-cover">
                        <FormItem
                            {...formItemLayout}
                            label="视频PC封面: "
                        >
                            <div className="dropbox">
                                {getFieldDecorator('video_pc', {
                                    initialValue: (updateOrNot && newsInfo) ? videoPcfileList : '',
                                    rules: [{required: true, message: '请上传视频PC端封面！'}]
                                })(
                                    <Upload
                                        action={`${URL}/pic/upload`}
                                        name='uploadFile'
                                        listType="picture-card"
                                        fileList={videoPcfileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleVideoPcChange}
                                    >
                                        {videoPcfileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                </Modal>
                                <span className="cover-img-tip">用于 PC 端新闻中视频封面展示, 建议尺寸: <font style={{color: 'red'}}>280px * 205px</font></span>
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="视频 M 端封面: "
                        >
                            <div className="dropbox">
                                {getFieldDecorator('video_m', {
                                    initialValue: (updateOrNot && newsInfo) ? videoMfileList : '',
                                    rules: [{required: true, message: '请上传视频PC端封面！'}]
                                })(
                                    <Upload
                                        action={`${URL}/pic/upload`}
                                        name='uploadFile'
                                        listType="picture-card"
                                        fileList={videoMfileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleVideoMChange}
                                    >
                                        {videoMfileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                </Modal>
                                <span className="cover-img-tip">用于 M 端新闻中视频封面展示, 建议尺寸: <font style={{color: 'red'}}>280px * 205px</font></span>
                            </div>
                        </FormItem>
                    </div> : ''}

                    <FormItem
                        {...formItemLayout}
                        label="内容: "
                    >
                        {getFieldDecorator('content', {
                            initialValue: (updateOrNot && newsInfo) ? newsContent : '',
                            rules: [{required: true, message: '请输入新闻内容！'}]
                        })(
                            <Input className="news" style={{display: 'none'}}/>
                        )}
                        <PostEditor
                            info={{'postContent': hxContent}}
                            subSend={(data) => this.sendPost(data)}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="标签: "
                    >
                        {getFieldDecorator('tags', {
                            initialValue: this.state.tags.join(','),
                            rules: [{required: true, message: '至少输入一个标签！'}]
                        })(
                            <Input className="tag-item" style={{display: 'none'}}/>
                        )}
                        <div>
                            {tags.map((tag, index) => {
                                const isLongTag = tag.length > 8
                                const tagElem = (
                                    <Tag
                                        color="blue" key={tag} closable={index !== -1}
                                        afterClose={() => this.handleClose(tag)}>
                                        {isLongTag ? `${tag.slice(0, 8)}` : tag}
                                    </Tag>
                                )
                                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem
                            })}
                            {inputVisible && (
                                <Input
                                    ref={this.saveInputRef}
                                    type="text"
                                    size="small"
                                    style={{width: 120}}
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            )}
                            {!inputVisible && tags.length < 3 && (
                                <Tag
                                    onClick={this.showInput}
                                    style={{background: '#fff', borderStyle: 'dashed'}}
                                >
                                    <Icon type="plus"/> New Tag
                                </Tag>
                            )}
                            <span>建议每篇新闻最多 <font style={{color: 'red'}}>3</font> 个标签, 每个标签最多<font
                                style={{color: 'red'}}> 8 </font>个字</span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="摘要: "
                    >
                        {getFieldDecorator('synopsis', {
                            initialValue: (updateOrNot && newsInfo) ? `${newsInfo.synopsis}` : '',
                            rules: [{max: 120, required: true, message: '请输入新闻内容摘要, 最多120字！'}]
                        })(
                            <TextArea className="news-summary" placeholder="新闻摘要, 最多120字"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="PC-封面: "
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pc', {
                                initialValue: (updateOrNot && newsInfo) ? fileList : '',
                                rules: [{required: true, message: '请上传新闻封面！'}]
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
                            <span className="cover-img-tip">用于 PC 端新闻封面展示, 建议尺寸: <font style={{color: 'red'}}>280px * 205px</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="PC-推荐位: "
                    >
                        <div className="dropbox">
                            {getFieldDecorator('pc_recommend', {
                                initialValue: (updateOrNot && newsInfo) ? pcfileList : ''
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={pcfileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handlePcChange}
                                >
                                    {pcfileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于 PC 端推荐位新闻封面展示, 建议尺寸: <font style={{color: 'red'}}>232px * 220px</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="M-缩略图: "
                    >
                        <div className="dropbox">
                            {getFieldDecorator('wap_small', {
                                initialValue: (updateOrNot && newsInfo) ? mfileList : '',
                                rules: [{required: true, message: '请上传手机端新闻缩略图！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={mfileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleMobileChange}
                                >
                                    {mfileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于 M 端新闻封面展示, 建议尺寸: <font style={{color: 'red'}}>145px * 110px</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="M-轮播图: ">
                        <div className="dropbox">
                            {getFieldDecorator('wap_big', {
                                initialValue: (updateOrNot && newsInfo) ? mcfileList : '',
                                rules: [{required: true, message: '请上传手机端新闻轮播图！'}]
                            })(
                                <Upload
                                    action={`${URL}/pic/upload`}
                                    name='uploadFile'
                                    listType="picture-card"
                                    fileList={mcfileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleMobileCommentChange}
                                >
                                    {mcfileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{width: '100%'}} src={previewImage}/>
                            </Modal>
                            <span className="cover-img-tip">用于 M 端推荐新闻的滚动展示, 建议尺寸: <font style={{color: 'red'}}>640px * 320px</font></span>
                        </div>
                    </FormItem>

                    <FormItem
                        wrapperCol={{span: 12, offset: 2}}
                    >
                        <Button
                            type="primary" onClick={this.newsVisibleShow} className="preview"
                            style={{marginRight: '10px'}}>新闻内容预览</Button>
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
                    <Modal
                        visible={newsVisible} footer={null} className="newsModal" onCancel={this.newsVisibleHide}
                        width={1000}>
                        <Row>
                            <Col
                                className="previewNews simditor">
                                <p
                                    className="simditor-body"
                                    style={{padding: 10}}
                                    dangerouslySetInnerHTML={this.createMarkup(newsContent)}></p>
                            </Col>
                        </Row>
                    </Modal>
                </Form>
            </Spin>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.postInfo.userInfo,
        newsInfo: state.postInfo.info
    }
}

export default connect(mapStateToProps)(Form.create()(PostSend))

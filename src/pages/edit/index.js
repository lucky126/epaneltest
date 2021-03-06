/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import {fromJS} from 'immutable'
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabBar,AtFloatLayout,AtGrid,AtMessage,AtToast  } from 'taro-ui'
import './index.scss';
import {QtnHeader} from '../../components/Qtncavas/QtnHeader'
import {PageList} from '../../components/Qtncavas/PageList'
import * as utils from "./utils/index";


@connect(({ edit, home, common }) => ({
  ...edit,
  ...home,
  ...common
}))

class Edit extends Component {
  config = {
    navigationBarTitleText: '编辑问卷',
  };

  constructor(props) {
    super(props)
    this.state = {
        currentBar:null,
        isOpened:false,
        isSave:false
        
    }
    this.handleClickBar = this.handleClickBar.bind(this)
    this.getQuestionnaire = this.getQuestionnaire.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentWillMount(){
      this.getQuestionnaire()
      this.getQuestionnaireVersion()
  }
  
  componentDidMount(){
    
  }

  //获得问卷信息
  getQuestionnaire(){
    const id = this.$router.params.id
    const params = {
        qtnId:id 
    }
    this.props.dispatch({
        type: 'edit/getQuestionnaire',
        payload: params,
        token: this.props.token
    })
  }

  //获取版本信息
  getQuestionnaireVersion(){
    const id = this.$router.params.id
    const params = {
        qtnId:id 
    }
    this.props.dispatch({
      type: 'edit/getQuestionnaireVersion',
      payload: params,
      token: this.props.token
  }).then(()=>{
    this.setState({
      isSave:false
    })
  })
  }

  handleClickBar(val){
    //0添加题目，1保存问卷，2发布问卷
    if(val === 0){
      this.setState({
        isOpened:true
      })
    }
    if(val === 1){
      this.setState({
        isSave:true
      })
      this.handleSave()
    }

    if(val === 2){
      const id = this.$router.params.id
      const {extQuery} = this.props
      this.handleSave()
      Taro.redirectTo({
        url: '/pages/invitation/index?id=' + id + extQuery
      })
    }

    if(val === 3){
      const id = this.$router.params.id
      this.handleShow(id)
    }
  }

  //保存问卷
  handleSave(){
    const {qtn,logicVersion} = this.props
    const params = {
      qtn,
      logicVersion
    }
    this.props.dispatch({
      type: 'edit/saveQuestionnaire',
      payload: params,
      token: this.props.token
  }).then(()=>{
    this.getQuestionnaireVersion()
  })
  }

  handleClose(){
    this.setState({
      isOpened:false
    })
  }

  //添加题目
  addQuestion(e, value) {
    const { isChange } = this.props
    let questionnaire = this.props.qtn
    const pages = questionnaire.pageList.length
    const type = value == 0 || value == 1 ? 1 : 2
    const selectType = value == 0 ? 0 : value == 1 ? 1 : value == 2 ? 1 : value == 3 ? 7 : ''
    let params = utils.getInitialData(type, selectType, fromJS(questionnaire));
    // const pageIndex = questionnaire.pageList.length
    // const qtIndex = questionnaire.pageList[pageIndex - 1].qtList.length
    // const disIndex = questionnaire.pageList[pageIndex - 1].qtList[qtIndex - 1].disSeq.replace(/[^0-9]/ig, "")
    // const fixIndex = questionnaire.pageList[pageIndex - 1].qtList[qtIndex - 1].fixSeq.replace(/[^0-9]/ig, "")
    // const lastType = questionnaire.pageList[pageIndex - 1].qtList[qtIndex - 1].type
    // params.disSeq = `Q${lastType == 6 ? 1 : parseInt(disIndex) + 1}`
    // params.fixSeq = `Q${lastType == 6 ? 1 : parseInt(fixIndex) + 1}`
    // params.mySeq = `Q${lastType == 6 ? 1 : parseInt(disIndex) + 1}`
    this.props.dispatch({
      type: 'edit/addQuestion',
      payload: params,
      token: this.props.token
    }).then(() => {
      const newQtList = questionnaire.pageList[pages - 1].qtList.concat(this.props.qt)
      questionnaire.pageList[pages - 1].qtList = newQtList
      let newQt = []
      questionnaire.pageList.map((val, key) => {
        newQt.push(JSON.parse(JSON.stringify(val)))
      })
      let seq = 1
      let deq = 1
      newQt.map((val) => {
        val.qtList.map((item, key) => {
          if (item.type == 6) {
            item.disSeq = `D${deq}`
            item.mySeq = `D${deq++}`
            item.seq = key + 1
          } else {
            item.disSeq = `Q${seq}`
            item.mySeq = `Q${seq++}`
            item.seq = key + 1
          }
        })
      })
      questionnaire.pageList = newQt
      this.props.dispatch({
        type: 'edit/save',
        payload: {
          qtn: questionnaire,
          isChange: !isChange
        }
      })
      this.setState({
        isOpened: false
      })
    })
  }

  //预览
  handleShow = (id) => {
    Taro.navigateTo({
      url: '/pages/home/show?id=' + id
    })
  }

  render() {
    const {isOpened,isSave} = this.state
    let text = '保存中'
    return (
      <View className='edit'>
         <AtMessage />
         <AtToast isOpened={isSave} hasMask text={text}></AtToast>
         <View className='editor__main'>
            <QtnHeader />
            <PageList />
         </View>
         {/* 底部bar */}
         <AtTabBar
           fixed
           tabList={[
            { title: '添加题目', iconType: 'add' },
            { title: '保存', iconType: 'check' },
            { title: '发布问卷', iconType: 'share-2' },
            { title: '预览', iconType: 'share' }
          ]}
           onClick={this.handleClickBar}
           current={this.state.currentBar}
         />
         <AtFloatLayout isOpened={isOpened} title='选择题目' onClose={this.handleClose}>
         <View>
         <AtGrid mode='rect' hasBorder={false} onClick={this.addQuestion} data={
            [
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                  value: '单选题'
                },
                {
                  image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                  value: '多选题'
                },
                {
                  image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                  value: '填空题'
                } 
              ]
            }
         />
        </View>
        </AtFloatLayout>
      </View>
    )
  }
}

export default Edit;

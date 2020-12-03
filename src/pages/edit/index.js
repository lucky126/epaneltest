/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import {fromJS} from 'immutable'
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabBar,AtFloatLayout,AtGrid,AtMessage  } from 'taro-ui'
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
        isOpened:false
        
    }
    this.handleClickBar = this.handleClickBar.bind(this)
    this.getQuestionnaire = this.getQuestionnaire.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount(){
      this.getQuestionnaire()
      this.getQuestionnaireVersion()
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
  addQuestion(e,value){
    const {isChange} = this.props
    let questionnaire = this.props.qtn
    const pages = questionnaire.pageList.length
    const type = value == 0 || value == 1 ? 1 : 2
    const selectType = value == 0 ? 0 :value == 1 ? 1 :value == 2 ? 1 :value == 3 ? 7 :''
    const params = utils.getInitialData(type, selectType, fromJS(this.props.qtn));
    this.props.dispatch({
          type: 'edit/addQuestion',
          payload: params,
          token: this.props.token
        }).then(()=>{
          console.log(questionnaire.pageList[pages-1].qtList)
    const newQtList = questionnaire.pageList[pages-1].qtList.concat(this.props.qt)
    questionnaire.pageList[pages-1].qtList = newQtList
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((qt,key)=>{
        if(qt.type != 6){
          qt.seq = key
          qt.disSeq = `Q${key}`
          qt.mySeq = `Q${key}`
        }
        
      })
    })
    console.log(questionnaire)
    this.props.dispatch({
        type: 'edit/save',
        payload: {
          qtn:questionnaire,
          isChange:!isChange
        }
      })
      this.setState({
        isOpened:false
      })
        })
    
  }

  render() {
    const {isOpened} = this.state
    return (
      <View className='edit'>
         <AtMessage />
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
            { title: '发布问卷', iconType: 'share-2' }
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

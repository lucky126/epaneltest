/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import { View, Checkbox } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { QuestionChoice } from "../../components/Question/QuestionChoice";
import { QuestionOpen } from "../../components/Question/QuestionOpen";
// eslint-disable-next-line import/first
import { AtButton,AtSwitch } from 'taro-ui'
import {fromJS} from 'immutable'

@connect(({ edit, home, common }) => ({
  ...edit,
  ...home,
  ...common
}))

class EditOpt extends Component {
  config = {
    navigationBarTitleText: '题目修改',
  };

  constructor(props) {
    super(props)
    this.state = {
      currentBar:null,
      value:false
    }
    this.HandleSave = this.HandleSave.bind(this)
    this.addPage = this.addPage.bind(this)
    this.handleRequired = this.handleRequired.bind(this)
  }

  componentDidMount(){
  
  }

  HandleSave(){
    const {questionnaire,isChange} = this.props
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        qtn:questionnaire,
        isChange:!isChange
      }
    })
    Taro.navigateBack({
      delta: 1 // 返回上一级页面。
      });   
  }

  addPage(){
    const {qtn,page,index,isChange} = this.props
    let questionnaire = qtn
    //let qtList = []
   const qtList = questionnaire.pageList[page-1].qtList
   //截取分页后的题目
   const qt = qtList.slice(index+1,qtList.length)
   const qt1 = qtList.slice(0,index+1)
   //删除分页后的题目
   //questionnaire.pageList[page-1].qtList.splice(index+1,qtList.length-index-1)
   //增加一页
   questionnaire.pageList.splice(page,0,questionnaire.pageList[page-1])
  //给增加页放入截取的题目
  console.log(questionnaire)
  console.log(qt)
  console.log(fromJS(questionnaire).getIn(['pageList',page-1]).toJS)
  questionnaire = fromJS(questionnaire).getIn(['pageList',page]).set('qtList',qt).toJS()
  questionnaire = fromJS(questionnaire).getIn(['pageList',page-1]).set('qtList',qt1).toJS()
  // questionnaire.pageList[page].qtList = qt
  // questionnaire.pageList[page-1].qtList = qt1
  // questionnaire.pageList.map((pg,key)=>{
  //   if(key === page) {
  //     pg.qtList = qt
  //     pg.pageName = `第${page}页`
  //     pg.title = `第${page}页`
  //   }
  // })
   this.props.dispatch({
    type: 'edit/save',
    payload: {
      questionnaire,
      isChange:!isChange
    }
  })
  }

  //必答设置
  handleRequired(required){
    console.log()
    const {qtn,optsList,isChange} = this.props
    let questionnaire = qtn
    questionnaire.pageList.map((pg)=>{
      pg.qtList.map((val)=>{
      if(val.disSeq === optsList.disSeq){
        val.required = required
      }
    })
    })
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        qtn:questionnaire,
        isChange:!isChange
      }
    })
  }

  render() {
      const {optsList} = this.props
      console.log(optsList)
    return (
      <View className='editOpt'>
         <View>
         <View className='editOpt-type'>题目修改</View>
         {optsList.type === 1 && <QuestionChoice  opts={optsList} />}
         {optsList.type === 2 &&  <QuestionOpen opts={optsList} />}
         </View>
         <View>
             <View className='editOpt-type'>属性修改</View>
             <View className='edit-select'>
             <AtSwitch title='必答' checked={optsList.required} onChange={this.handleRequired} />
             <AtSwitch title='增加分页' checked={this.state.value} onChange={this.addPage} />
             </View>
         </View>
         <View className='opt-save'><AtButton type='primary' onClick={this.HandleSave}>保存修改</AtButton></View>
      </View>
    )
  }
}

export default EditOpt;

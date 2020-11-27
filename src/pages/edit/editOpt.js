/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import { View, Checkbox } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { QuestionChoice } from "../../components/Question/QuestionChoice";
import { QuestionOpen } from "../../components/Question/QuestionOpen";
// eslint-disable-next-line import/first
import { AtButton } from 'taro-ui'

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
    this.state = {currentBar:null
    }
    this.HandleSave = this.HandleSave.bind(this)
    this.addPage = this.addPage.bind(this)
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
   //删除分页后的题目
   questionnaire.pageList[page-1].qtList.splice(index+1,qtList.length-index-1)
   //增加一页
   questionnaire.pageList.splice(page,0,questionnaire.pageList[page-1])
  //给增加页放入截取的题目
   //questionnaire.pageList[page].qtList = qt
   console.log(questionnaire)
   this.props.dispatch({
    type: 'edit/save',
    payload: {
      questionnaire,
      isChange:!isChange
    }
  })
  }

  render() {
      const {optsList} = this.props
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
             <Checkbox value='选中' ></Checkbox>
             <View>必答</View>
             </View>
             <View className='edit-select'>
             <Checkbox value='选中' onClick={this.addPage}></Checkbox>
             <View >增加分页</View>
             </View>
         </View>
         <View className='opt-save'><AtButton type='primary' onClick={this.HandleSave}>保存修改</AtButton></View>
      </View>
    )
  }
}

export default EditOpt;

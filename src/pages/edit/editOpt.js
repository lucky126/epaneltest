/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import { View, Checkbox } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { QuestionChoice } from "../../components/Question/QuestionChoice";
import { QuestionOpen } from "../../components/Question/QuestionOpen";
import { QuestionDescribe } from "../../components/Question/QuestionDescribe";
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
    this.removePage = this.removePage.bind(this)
  }

  componentDidMount(){
  
  }

  HandleSave(){
    const {questionnaire,isChange} = this.props
    // this.props.dispatch({
    //   type: 'edit/save',
    //   payload: {
    //     qtn:questionnaire,
    //     isChange:!isChange
    //   }
    // })
    Taro.navigateBack({
      delta: 1 // 返回上一级页面。
      });   
  }

  addPage(val){
    const {qtn,pageIndex,index,isChange} = this.props
    let questionnaire = qtn
    const pageItem = questionnaire.pageList[pageIndex-1];
    const qtList = pageItem.qtList;
    // 题目在当前页最后位置时，不必添加翻页
    if(val){
      if (qtList.length <= index) {
            questionnaire.pageList;
          } else {
            questionnaire.pageList.splice(
              pageIndex-1,
              1,
              ...[
                fromJS(pageItem).set("qtList", qtList.slice(0, index + 1)).toJS(),
                fromJS(pageItem).set("qtList", qtList.slice(index + 1)).toJS()
              ]
            );
          }
          this.props.dispatch({
            type: 'edit/save',
            payload: {
              questionnaire,
              isChange:!isChange
            }
          })
    }else{
      this.removePage()
    }
  }

  //必答设置
  handleRequired(required){
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

  removePage() {
    const {qtn,pageIndex,index,isChange} = this.props
    let questionnaire = qtn
      if (pageIndex + 1 === questionnaire.pageList.size) {
         questionnaire.pageList;
      }
  
      const pageItem = questionnaire.pageList[pageIndex-1];
      const pageNextItem = questionnaire.pageList[pageIndex];
       questionnaire.pageList.splice(
        pageIndex-1,
        2,
        fromJS(pageItem).update("qtList", qtList =>
          qtList.concat(pageNextItem.qtList)
        ).toJS()
      );
      this.props.dispatch({
        type: 'edit/save',
        payload: {
          qtn:questionnaire,
          isChange:!isChange
        }
      })
  }

  render() {
    const { optsList, pageIndex, qtn, index } = this.props
    const isAdd = qtn.pageList[pageIndex - 1].qtList.length - 1 == index
    return (
      <View className='editOpt'>
        <View>
          <View className='editOpt-type'>题目修改</View>
          {optsList.type === 1 && <QuestionChoice opts={optsList} />}
          {optsList.type === 2 && <QuestionOpen opts={optsList} />}
          {optsList.type === 6 && <QuestionDescribe opts={optsList} />}
        </View>
        <View>
          <View className='editOpt-type'>属性修改</View>
          <View className='edit-select'>
            {optsList.type != 6 && optsList.selectType != 0 && <AtSwitch title='必答' checked={optsList.required} onChange={this.handleRequired} />}
            <AtSwitch title='增加分页' checked={isAdd} onChange={this.addPage} />
          </View>
        </View>
        <View className='opt-save'><AtButton type='primary' onClick={this.HandleSave}>保存修改</AtButton></View>
      </View>
    )
  }
}

export default EditOpt;

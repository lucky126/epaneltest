/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import { View, Checkbox } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { QuestionChoice } from "../../components/Question/QuestionChoice";
import { QuestionOpen } from "../../components/Question/QuestionOpen";
// eslint-disable-next-line import/first
import { AtButton,AtSwitch } from 'taro-ui'
// eslint-disable-next-line import/first
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
    this.addPage1 = this.addPage1.bind(this)
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
  console.log(fromJS(questionnaire).getIn(['pageList',page-1]))
  fromJS(questionnaire).setIn(['pageList',page,'qtList'],qt).toJS()
  fromJS(questionnaire).setIn(['pageList',page-1,'qtList'],qt1).toJS()
  // questionnaire.pageList[page].qtList = qt
  // questionnaire.pageList[page-1].qtList = qt1
  // questionnaire.pageList.map((pg,key)=>{
  //   if(key === page) {
  //     pg.qtList = qt
  //     pg.pageName = `第${page}页`
  //     pg.title = `第${page}页`
  //   }
  // })
  this.addPage1(page,index)
  console.log(this.addPage1(page,index))
   this.props.dispatch({
    type: 'edit/save',
    payload: {
      questionnaire,
      isChange:!isChange
    }
  })
  }


  addPage1(page, position) {
    const {qtn} = this.props
    fromJS(qtn.pageList).map((pageList)=>{
      const pageItem = pageList.get(page);
      console.log(pageItem.toJS())
      const qtList = pageItem.get("qtList");
  
      //获取要插入页码位置的题型和序号
      let curType = pageList.getIn([page, "qtList", position, "type"]);
      let curSeq = pageList.getIn([page, "qtList", position, "seq"]);
      let curMySeq = pageList
        .getIn([page, "qtList", position, "mySeq"])
        .replace(/\.\w+/g, "");
  
      //指标题只能在最后一个追问题后面添加分页
      if (curType === 10 || curType == 9) {
        //如果当前题是指标题或者追问题则需要寻找该题最大的位置编号
        pageList.getIn([page, "qtList"]).map(question => {
          let mySeq = question.get("mySeq").replace(/\.\w+/g, "");
          //比当前题号大的指标题一定只能是追问题
          if (
            question.get("seq") > curSeq &&
            question.get("type") === 10 &&
            mySeq == curMySeq
          ) {
            //得到该题追问题的最大位置
            position++;
          }
        });
      }
  
      // 题目在当前页最后位置时，不必添加翻页
      if (qtList.size <= position + 1) {
        return pageList;
      } else {
        return pageList.splice(
          page,
          1,
          ...[
            pageItem.set("qtList", qtList.slice(0, position + 1)),
            pageItem.set("qtList", qtList.slice(position + 1))
          ]
        );
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

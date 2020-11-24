/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { QuestionChoice } from "../../components/Question/QuestionChoice";
import { QuestionOpen } from "../../components/Question/QuestionOpen";

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
    
  }

  componentDidMount(){
  
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
             <View>必答</View>
             <View>增加分页</View>
         </View>
         <View>保存修改</View>
      </View>
    )
  }
}

export default EditOpt;

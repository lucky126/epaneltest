/* eslint-disable react/no-unused-state */
import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabBar } from 'taro-ui'
import './index.scss';
import {QtnHeader} from '../../components/Qtncavas/QtnHeader'
import {PageList} from '../../components/Qtncavas/PageList'

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
        currentBar:null
    }
    this.handleClickBar = this.handleClickBar.bind(this)
    this.getQuestionnaire = this.getQuestionnaire.bind(this)
  }

  componentWillMount(){
      this.getQuestionnaire()
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

  handleClickBar(val){
    console.log(val)
  }

  render() {
    return (
      <View className='edit'>
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
      </View>
    )
  }
}

export default Edit;

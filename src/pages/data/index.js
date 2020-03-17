import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabs, AtTabsPane } from 'taro-ui'
import RetrievalProgress from '../../components/RetrievalProgress'
import './index.scss';

@connect(({ data, common }) => ({
  ...data,
  ...common
}))

class Data extends Component {
  config = {
    navigationBarTitleText: '分析下载',
  };

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
    }
  }

  componentDidMount = () => {
    if (!this.props.token) {
      Taro.redirectTo({
        url: '../login/index'
      })
    }

    this.getData()
  };

  getData = () => {
    const { id } = this.$router.params

    //获得问卷进度数据
    this.props.dispatch({
      type: 'data/getRetrievalProgress',
      payload: { qtnId: id },
      token: this.props.token
    }).then(() => {
      console.log('get RetrievalProgress')
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }


  render() {
    const { RetrievalProgressData } = this.props
    const tabList = [{ title: '回收进度' }, { title: '样本数据' }, { title: '图表分析' }]
    
    return (
      <View className='page'>
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            <RetrievalProgress RetrievalProgressData={RetrievalProgressData} />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页三的内容</View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Data;

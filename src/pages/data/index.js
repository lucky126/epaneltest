import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabs, AtTabsPane } from 'taro-ui'
import RetrievalProgress from '../../components/RetrievalProgress'
import AnswerData from '../../components/AnswerData'
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
      qtnId: 0,
      current: 0,
      pageSize: 20,
      status: null,
      startTime: null,
      endTime: null,
    }
  }

  componentWillMount = () => {
    this.setState({
      qtnId: this.$router.params.id
    });
    this.props.dispatch({
      type: 'data/save',
      payload: {
        resultPage: 1,
        resultData: []
      },
    });
  };

  // 需要返回刷新，使用该方法获取数据，对应小程序的onShow
  componentDidShow = () => {
    this.getData(this.$router.params.id)
  }

  getData = (qtnId) => {
    //获得问卷进度数据
    this.props.dispatch({
      type: 'data/getRetrievalProgress',
      payload: { qtnId },
      token: this.props.token
    })

    this.getResultData(qtnId)
  }

  getResultData = (qtnId) => {
    const { pageSize, status, startTime, endTime } = this.state
    const { resultPage } = this.props

    //获得问卷进度数据
    this.props.dispatch({
      type: 'data/getAnswerStatus',
      payload: { qtnId, page: resultPage, pageSize, status, startTime, endTime },
      token: this.props.token
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  // 小程序上拉加载
  onReachBottom() {
    // 只允许样本数据上拉加载
    if(this.state.current===1)
    {
      const { qtnId } = this.state
      this.props.dispatch({
        type: 'data/save',
        payload: {
          resultPage: this.props.resultPage + 1,
        },
      });
      this.getResultData(qtnId)
    }
  }

  onShowResult = (resultId, index) => {
    const { qtnId } = this.state
    
    Taro.navigateTo({
      url: '/pages/data/anwserdetail?qtnId='+ qtnId + '&rid=' + resultId + '&idx=' + index
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
            <AnswerData data={this.props.resultData}  onShowResult={this.onShowResult} />
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>尽请期待</View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Data;

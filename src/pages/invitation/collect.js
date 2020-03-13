import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtNavBar, AtList, AtListItem, AtFloatLayout } from 'taro-ui'

@connect(({ invitation, common }) => ({
  ...invitation,
  ...common
}))

class Collect extends Component {
  config = {
    navigationBarTitleText: '收集设置',
  };

  constructor(props) {
    super(props)
    this.state = {
      qtnId: 0
    }
  }

  componentDidMount() {
    this.setState({
      qtnId: this.$router.params.id,
      isOpened: false
    });
    this.getData(this.$router.params.id)
  };

  getData(qtnId) {

    // 获取问卷收集设置
    this.props.dispatch({
      type: 'invitation/getPanelDemand',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      console.log('get PanelDemand')
    })

    // 获取问卷唯一限制设置
    this.props.dispatch({
      type: 'invitation/getLimitConstraints',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      console.log('get LimitConstraints')
    })
  }

  handleBack() {
    Taro.navigateBack({
      delta: 1
    })
  }

  handlePanelSetting = () => {
    this.setState({
      isOpened: true
    })
  }

  handleBeginTimeSetting = () => {

  }

  handleExpireTimeSetting = () => {

  }

  handleClose = () => {
    this.setState({
      isOpened: false
    })
  }

  render() {
    const { limitConstraints, panelDemand } = this.props
    console.log(panelDemand)
    console.log(limitConstraints)

    let panelTotalNum = panelDemand.limitPanelNum ? panelDemand.panelTotalNum : '未设置'
    let beginTime = panelDemand.limitBeginTime ? panelDemand.beginTime : '未设置'
    let expireTime = panelDemand.limitExpireTime ? panelDemand.expireTime : '未设置'

    let ipLimitNum = limitConstraints.ipLimit ? limitConstraints.ipLimitNum : '未设置'
    let answerLimitNum = '未设置'

    const answerLimitInfo = !!limitConstraints.moreConf && JSON.parse(limitConstraints.moreConf)
    answerLimitNum = answerLimitInfo.isSetPeriodLimit ? answerLimitInfo.limit : '未设置'

    return (
      <View className='page'>
        <AtNavBar
          onClickLeftIcon={this.handleBack}
          color='#000'
          title='收集设置'
          leftText='返回'
        />
        <View className='panel at-col at-col-12'>
          <View className='panel__title'>基础设置</View>
          <View className='panel__content no-padding'>
            <View className='example-item'>
              <AtList>
                <AtListItem title='目标数量'
                  arrow='right'
                  extraText={panelTotalNum}
                  onClick={this.handlePanelTotalNumSetting}
                />
                <AtListItem title='开始时间'
                  arrow='right'
                  extraText={beginTime}
                  onClick={this.handleBeginTimeSetting}
                />
                <AtListItem title='结束时间'
                  arrow='right'
                  extraText={expireTime}
                  onClick={this.handleExpireTimeSetting}
                />
              </AtList>

            </View>
          </View>
        </View>

        <View className='panel at-col at-col-12'>
          <View className='panel__title'>唯一设置</View>
          <View className='panel__content no-padding'>
            <View className='example-item'>
              <AtList>
                <AtListItem title='IP地址限制'
                  arrow='right'
                  extraText={ipLimitNum} o
                  nClick={this.handleClick}
                />
                <AtListItem title='答题设备唯一'
                  isSwitch
                  switchIsCheck={limitConstraints.deviceUniqueness}
                  onClick={this.handleClick}
                />
                <AtListItem title='每日限答次数'
                  arrow='right'
                  extraText={answerLimitNum}
                  onClick={this.handleClick}
                />
              </AtList>

            </View>
          </View>
        </View>

        <AtFloatLayout isOpened={this.state.isOpened} title='这是个标题' onClose={this.handleClose.bind(this)}>
          这是内容区 随你怎么写这是内容区 随你怎么写这是内容区 随你怎么写这是内容区
          随你怎么写这是内容区 随你怎么写这是内容区 随你怎么写
        </AtFloatLayout>
      </View>
    )
  }
}

export default Collect;

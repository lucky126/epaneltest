import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { DateTimePicker } from '../../components/DateTimePicker'
import './index.scss';
import { AtNavBar, AtList, AtListItem, AtFloatLayout, AtInput, AtSwitch, AtMessage } from 'taro-ui'

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
      qtnId: 0,
      isShowTotalNum: false,
      isShowBeginTime: false,
      isShowExpireTime: false,
      isShowIpLimit: false,
      isShowAnswerLimit: false
    }
  }

  componentDidMount() {
    this.setState({
      qtnId: this.$router.params.id
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

  showSuccessMsg = () => {
    Taro.atMessage({
      'message': '更新成功！',
      'type': 'success',
      'duration': 1000
    })
  }

  // 样本数量设置面板
  handlePanelTotalNumSetting = (value) => {
    this.setState({
      isShowTotalNum: value
    })
  }

  // 修改样本设置开关
  handleChangeSetTotalNum(value) {

    if (!value) {
      this.props.dispatch({
        type: 'invitation/save',
        payload: {
          panelTotalNum: 0
        }
      })
    }

    this.props.dispatch({
      type: 'invitation/save',
      payload: { limitPanelNum: value }
    })

    this.updatePanelDemand()
  }

  // 修改样本数量
  handleChangeTotalNum = (value) => {
    this.props.dispatch({
      type: 'invitation/save',
      payload: { panelTotalNum: value }
    })

    this.updatePanelDemand()
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  // 保存样本设置
  updatePanelDemand = () => {
    let { limitPanelNum, panelTotalNum, limitBeginTime, beginTime, limitExpireTime, expireTime } = this.props
    const { qtnId } = this.state

    this.props.dispatch({
      type: 'invitation/updatePanelDemand',
      payload: {
        qtnId,
        limitPanelNum,
        panelTotalNum,
        beginTime: limitBeginTime ? beginTime : "",
        expireTime: limitExpireTime ? expireTime : ""
      }
    }).then(() => {
      this.showSuccessMsg()
    })
  }

  // 开始时间设置开关
  handleBeginTimeSetting = (value) => {
    this.setState({
      isShowBeginTime: value
    })
  }

  // 截止时间设置开关
  handleExpireTimeSetting = (value) => {
    this.setState({
      isShowExpireTime: value
    })
  }

  // 保存开始时间设置
  saveBeginTime = ({ current }) => {
    console.log('save begintime')
    console.log(current)

    this.props.dispatch({
      type: 'invitation/save',
      payload: {
        limitBeginTime: true,
        beginTime: current
      }
    })

    this.updatePanelDemand()

    this.handleBeginTimeSetting(false)
  }

  // 清除开始时间设置
  clearBeginTime = () => {
    console.log('clear begintime')

    this.props.dispatch({
      type: 'invitation/save',
      payload: {
        limitBeginTime: false,
        beginTime: ''
      }
    })

    this.updatePanelDemand()

    this.handleBeginTimeSetting(false)
  }

  // 保存截至时间设置
  saveExpireTime = ({ current }) => {
    console.log('save expiretime')
    console.log(current)

    this.props.dispatch({
      type: 'invitation/save',
      payload: {
        limitExpireTime: true,
        expireTime: current
      }
    })

    this.updatePanelDemand()

    this.handleExpireTimeSetting(false)
  }

  // 清除截止时间设置
  clearExpireTime = () => {
    console.log('clear expiretime')

    this.props.dispatch({
      type: 'invitation/save',
      payload: {
        limitExpireTime: false,
        expireTime: ''
      }
    })

    this.updatePanelDemand()

    this.handleExpireTimeSetting(false)
  }

  // IP限制设置面板
  handleIpLimitSetting = (value) => {
    this.setState({
      isShowIpLimit: value
    })
  }

  // 修改IP限制设置开关
  handleChangeSetIpLimit(value) {
    let { ipLimit } = this.props

    let ipLimitlNum = 0
    
    if (!ipLimit) {
      ipLimitlNum = 3
    }

    if (!value) {
      this.props.dispatch({
        type: 'invitation/save',
        payload: {
          ipLimitlNum: ipLimitlNum
        }
      })
    }

    this.props.dispatch({
      type: 'invitation/save',
      payload: { ipLimit: value }
    })

    this.updateLimitConstraints()
  }

  // 修改IP限制数量
  handleChangeIpLimitNum = (value) => {
    this.props.dispatch({
      type: 'invitation/save',
      payload: { ipLimitlNum: value }
    })

    this.updateLimitConstraints()
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  // 保存唯一限制设置
  updateLimitConstraints = () => {
    let { ipLimit, ipLimitNum, deviceUniqueness, isAnswerLimit, limitNum, moreConf } = this.props
    const { qtnId } = this.state

    this.props.dispatch({
      type: 'invitation/updateLimitConstraints',
      payload: {
        qtnId,
        ipLimit,
        ipLimitNum,
        deviceUniqueness,
        moreConf
      }
    }).then(() => {
      this.showSuccessMsg()
    })
  }

  render() {
    const { limitPanelNum, panelTotalNum, limitBeginTime, beginTime, limitExpireTime, expireTime } = this.props
    const { ipLimit, ipLimitNum, deviceUniqueness, isAnswerLimit, limitNum } = this.props

    let beginTimeList = limitBeginTime ? beginTime : '未设置'
    let expireTimeList = limitExpireTime ? expireTime : '未设置'

    let ipLimitNumList = ipLimit ? ipLimitNum : '未设置'

    let answerLimitNum = '未设置'
    answerLimitNum = isAnswerLimit ? limitNum : '未设置'

    return (
      <View className='page'>
        <AtMessage />
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
                  extraText={limitPanelNum ? panelTotalNum : '未设置'}
                  onClick={this.handlePanelTotalNumSetting.bind(this, true)}
                />
                <AtListItem title='开始时间'
                  arrow='right'
                  extraText={beginTimeList}
                  onClick={this.handleBeginTimeSetting.bind(this, true)}
                />
                <AtListItem title='结束时间'
                  arrow='right'
                  extraText={expireTimeList}
                  onClick={this.handleExpireTimeSetting.bind(this, true)}
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
                  extraText={ipLimitNumList}
                  onClick={this.handleIpLimitSetting.bind(this, true)}
                />
                <AtListItem title='答题设备唯一'
                  isSwitch
                  switchIsCheck={deviceUniqueness}
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

        <AtFloatLayout isOpened={this.state.isShowTotalNum} title='回收成功样本数量设置'
          onClose={this.handleIpLimitSetting.bind(this, false)}>
          <View className='at-row'>
            <View className='at-col at-col-12'>
              <AtSwitch title='开启设置' checked={limitPanelNum} onChange={this.handleChangeSetTotalNum.bind(this)} />
            </View>
          </View>
          {(limitPanelNum) ? (
            <View className='at-row'>
              <View className='at-col at-col-12'>
                <AtInput
                  name='value'
                  title='样本数量'
                  type='text'
                  placeholder='请输入样本数量'
                  value={limitPanelNum ? panelTotalNum : 0}
                  onChange={this.handleChangeTotalNum.bind(this)}
                />
              </View>
            </View>
          ) : (<View></View>)}
        </AtFloatLayout>

        <AtFloatLayout isOpened={this.state.isShowBeginTime} title='开始时间设置'
          onClose={this.handleBeginTimeSetting.bind(this, false)}>
          <DateTimePicker initValue={beginTime}
            onOk={this.saveBeginTime}
            onClear={this.clearBeginTime} />
        </AtFloatLayout>

        <AtFloatLayout isOpened={this.state.isShowExpireTime} title='结束时间设置'
          onClose={this.handleExpireTimeSetting.bind(this, false)}>
          <DateTimePicker initValue={expireTime}
            onOk={this.saveExpireTime}
            onClear={this.clearExpireTime} />
        </AtFloatLayout>

        <AtFloatLayout isOpened={this.state.isShowIpLimit} title='IP地址限制设置'
          onClose={this.handlePanelIpLimitSetting.bind(this, false)} >
          <View className='at-row'>
            <View className='at-col at-col-12'>
              <AtSwitch title='开启设置' checked={ipLimit} onChange={this.handleChangeSetIpLimit.bind(this)} />
            </View>
          </View>
          {(limitPanelNum) ? (
            <View className='at-row'>
              <View className='at-col at-col-12'>
                <AtInput
                  name='value'
                  title='同一IP最多可答题数量'
                  type='text'
                  placeholder='请输入数量'
                  value={ipLimit ? ipLimitNum : 0}
                  onChange={this.handleChangeIpLimitNum.bind(this)}
                />
              </View>
            </View>
          ) : (<View></View>)}
        </AtFloatLayout>
      </View>
    )
  }
}

export default Collect;

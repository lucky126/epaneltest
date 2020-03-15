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
      isShowExpireTime: false
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

  // 打开样本数量设置面板
  handlePanelTotalNumSetting = (value) => {
    this.setState({
      isShowTotalNum: value
    })
  }

  // 修改样本设置开关let
  handleChangeSetTotalNum(value) {
    let { panelTotalNum, limitBeginTime, beginTime, limitExpireTime, expireTime } = this.props
    const { qtnId } = this.state

    if (!value) {
      panelTotalNum = 0

      this.props.dispatch({
        type: 'invitation/save',
        payload: {
          panelTotalNum: panelTotalNum
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

  render() {
    const { limitConstraints, limitPanelNum, panelTotalNum, limitBeginTime, beginTime, limitExpireTime, expireTime } = this.props

    let beginTimeList = limitBeginTime ? beginTime : '未设置'
    let expireTimeList = limitExpireTime ? expireTime : '未设置'

    let ipLimitNum = limitConstraints.ipLimit ? limitConstraints.ipLimitNum : '未设置'
    let answerLimitNum = '未设置'

    const answerLimitInfo = !!limitConstraints.moreConf && JSON.parse(limitConstraints.moreConf)
    answerLimitNum = answerLimitInfo.isSetPeriodLimit ? answerLimitInfo.limit : '未设置'

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
                  extraText={ipLimitNum}
                  onClick={this.handleClick}
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

        <AtFloatLayout isOpened={this.state.isShowTotalNum} title='回收成功样本数量设置'
          onClose={this.handlePanelTotalNumSetting.bind(this, false)}>
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
      </View>
    )
  }
}

export default Collect;

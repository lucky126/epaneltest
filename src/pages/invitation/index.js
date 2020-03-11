import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { BeginToCollect } from '../../components/beginToCollect'
import './index.scss';
import { AtTabs, AtTabsPane, AtNavBar } from 'taro-ui'

@connect(({ invitation, common }) => ({
  ...invitation,
  ...common
}))

class Invitation extends Component {
  config = {
    navigationBarTitleText: '收集数据',
  };

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      qtnId: 0
    }
  }

  componentDidMount() {
    this.getData()
  };

  getData() {
    const { id } = this.$router.params
    this.setState({
      qtnId: id
    })
    //获得问卷发布状态
    this.props.dispatch({
      type: 'invitation/statusCheck',
      payload: { qtnId: id },
      token: this.props.token
    }).then(() => {
      console.log('get statusCheck')
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  handleSetting() {

  }

  beginRetrieveData = () => {
    const{ qtnId } = this.state
    console.log('qtnId=' + qtnId)
    // 更新问卷发布状态
    this.props.dispatch({
      type: 'invitation/beginRetrieve',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      console.log('update statusCheck')
    })
  }

  render() {
    const { qtnStatus } = this.props
    let tabList = [{ title: '收集设置' }]
    if(qtnStatus !== 0){
      tabList = [{ title: '开放链接' }, { title: '其他渠道' }]
    }

    return (
      <View className='page'>
        <AtNavBar
          onClickRgIconSt={this.handleSetting}
          color='#000'
          title='收集数据'
          rightFirstIconType='settings'
        />
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            {(qtnStatus === 0) ? (
              <BeginToCollect beginRetrieveData={this.beginRetrieveData} />
            ) : (
                <Text>已发布</Text>
              )}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
          </AtTabsPane>
        </AtTabs>

      </View>
    )
  }
}

export default Invitation;

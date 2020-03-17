import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { BeginToCollect } from '../../components/beginToCollect'
import { Link } from '../../components/link'
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
    this.setState({
      qtnId: this.$router.params.id,
    });
    this.getData(this.$router.params.id)
  };

  getData(qtnId) {
    //获得问卷发布状态
    this.props.dispatch({
      type: 'invitation/statusCheck',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      console.log('get statusCheck')
      if (this.props.qtnStatus !== 0) {
        this.getWebLink(qtnId)
      }
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  handleSetting = () => {
    const { qtnId } = this.state
    
    Taro.navigateTo({
      url: '/pages/invitation/collect?id=' + qtnId
    })
  }

  beginRetrieveData = () => {
    const { qtnId } = this.state

    // 更新问卷发布状态
    this.props.dispatch({
      type: 'invitation/beginRetrieve',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      console.log('update statusCheck')
    })
  }

  getWebLink(id) {

    // 获取问卷链接和二维码地址
    this.props.dispatch({
      type: 'invitation/getWebLink',
      payload: { qtnId: id },
      token: this.props.token
    }).then(() => {
      console.log('get WebLink')
    })

  }

  render() {
    const { qtnStatus, linkData } = this.props

    let rightFirstIconType = ''
    let tabList = [{ title: '收集设置' }]
    if (qtnStatus !== 0) {
      tabList = [{ title: '开放链接' }, { title: '封闭链接' }]
      rightFirstIconType = 'settings'
    }

    return (
      <View className='page'>
        <AtNavBar
          onClickRgIconSt={this.handleSetting}
          color='#000'
          title='收集数据'
          rightFirstIconType={rightFirstIconType}
        />
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            {(qtnStatus === 0) ? (
              <BeginToCollect beginRetrieveData={this.beginRetrieveData} />
            ) : (
                <Link linkData={linkData} />
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

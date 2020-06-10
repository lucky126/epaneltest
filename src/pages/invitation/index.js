import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabs, AtTabsPane, AtNavBar } from 'taro-ui'
import { BeginToCollect } from '../../components/beginToCollect'
import { Link } from '../../components/link'
import './index.scss';

@connect(({ invitation, home, common }) => ({
  ...invitation,
  ...home,
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
      qtnId: 0,
      view: false,
    }
  }

  componentWillMount() {
    this.setState({
      qtnId: this.$router.params.id,
      view: this.$router.params.view
    });
    this.getData(this.$router.params.id)
  };

  getData(qtnId) {
    this.props.dispatch({
      type: 'home/getQuestionnaireName',
      payload: { qtnId },
      token: this.props.token
    })
    //获得问卷发布状态
    this.props.dispatch({
      type: 'invitation/statusCheck',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      // console.log('get statusCheck')
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
    })
  }

  getWebLink(id) {

    // 获取问卷链接和二维码地址
    this.props.dispatch({
      type: 'invitation/getWebLink',
      payload: { qtnId: id },
      token: this.props.token
    })

  }

  onShareAppMessage (res) {
    const { qtnName, linkData } = this.props

    let weblinkUrl = linkData ? linkData.weblinkUrl : ''

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: qtnName + '--云调查',
      path: '/pages/invitation/answer?url=' + encodeURI(weblinkUrl),
      imageUrl: 'https://www.epanel.cn/images/answer.jpg'
    }
  }

  render() {
    const { qtnStatus, linkData, qtnName } = this.props

    let rightFirstIconType = ''
    let tabList = [{ title: '收集设置' }]
    if (qtnStatus !== 0) {
      tabList = [{ title: '开放链接' }, { title: '配额管理' }]
      rightFirstIconType = 'settings'
    }

    let title = '收集数据--' + qtnName

    return (
      <View className='page'>
        <AtNavBar
          onClickRgIconSt={this.handleSetting}
          color='#000'
          title={title}
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
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>尽请期待</View>
          </AtTabsPane>
        </AtTabs>

      </View>
    )
  }
}

export default Invitation;

import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux';
import './wxlogin.scss';

@connect(({ login, common }) => ({
  ...login,
  ...common
}))

class Index extends Component {
  config = {
    navigationBarTitleText: '微信授权登录',
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {

  };

  tobegin = (res) => {
    if(res.detail.userInfo){ // 返回的信息中包含用户信息则证明用户允许获取信息授权
      console.log('授权成功')
    
      Taro.login()
        .then(resLogin => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (resLogin.code){
            // 登录
            console.log(resLogin.code)
          }
        })
    } else {
      Taro.navigateBack({
        delta: 1
      })
    }
  }

  render() {
    return (
      <View className='page'>
        <View className='textAlign need'>需要使用你的微信昵称和头像</View>
        <AtButton
          type='primary'
          openType='getUserInfo'
          onGetUserInfo={this.tobegin}
        >
          点击授权
        </AtButton>
        <AtButton
          type='secondary'
          onClick={() => Taro.navigateBack({
            delta: 1
          })}
        >
          暂不登录
      </AtButton>
      </View>
    )
  }
}

export default Index;

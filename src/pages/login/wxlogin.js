import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux';
import './wxlogin.scss';

@connect(({ login, common }) => ({
  ...login,
  ...common
}))

class WxLogin extends Component {
  config = {
    navigationBarTitleText: '云调查',
  };

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount = () => {

  }

  handleWxLogin = () => {
    Taro.login()
      .then(r => {
        var code = r.code //登录凭证
        console.log(code)
        if (code) {
          //2 调用获取用户信息接口
          Taro.getUserInfo({
            success: function (res) {
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
            }

          })
        }
      })

    // if (res.detail.userInfo) { // 返回的信息中包含用户信息则证明用户允许获取信息授权
    //   console.log(res.detail)
    //   console.log(res.detail.encryptedData)
    //   Taro.login()
    //     .then(resLogin => {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId

    //       if (resLogin.code) {
    //         // 登录
    //         console.log(resLogin.code)
    //         this.props.dispatch({
    //           type: 'login/wxCode2Session',
    //           payload: resLogin.code
    //         }).then(() => {
    //           console.log('login result')
    //         })
    //       }
    //     })
    // } else {
    //   Taro.showToast({
    //     title: '微信登录失败',
    //     icon: 'error',
    //     duration: 1000
    //   })
    // }
  }

  render() {

    return (
      <View className='wxlogin-page'>
        <View className='login'>

          <View class='alert'>
            <View class='alert-title'>尊敬的用户，请确认授权以下信息</View>
            <View class='alert-desc'>
              <View class='alert-text'>获得你的公开信息（昵称、头像等）</View>
            </View>
            <AtButton type='primary' circle openType='getUserInfo' onGetUserInfo={this.handleWxLogin} >确认登录</AtButton>
          </View>
          
        </View>

        <View class='logged'>
          {/* <Image class='logged-icon' src='../../images/iconfont-weixin.png' /> */}
          <View class='logged-text'>近期你已经授权登陆过</View>
          <View class='logged-text'>自动登录中</View>
        </View>
      </View >
    )
  }
}

export default WxLogin;

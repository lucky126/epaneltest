import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux';
import './wxlogin.scss';

@connect(({ login }) => ({
  ...login,
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
          let params = ''
          Taro.getUserInfo({
            success: function (res) {
              params = { encryptedData: res.encryptedData, iv: res.iv, code: code }
            }
          })

          console.log(params)
          if (params) {
            this.props.dispatch({
              type: 'login/wxLogin',
              payload: {}
            }).then(() => {
              console.log('wx login')
            })
          }else{
            console.log('wxlogin error')
          }
        }
      })


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

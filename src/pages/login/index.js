import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux';
import Logo from '../../assets/images/logo.png'
import './index.scss';

@connect(({login, common}) => ({
  ...login,
  ...common
}))

class Index extends Component {
  config = {
    navigationBarTitleText: '云调查',
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    const token = Taro.getStorageSync('token');
    if (!!token) {
      Taro.redirectTo({ url: '/pages/home/index' })
      return
    }
  };
  
  handleForm = () => {
    Taro.navigateTo({
      url: '/pages/login/formlogin'
    })
  }
  
  handleWeappLogin = (res) => {
    if(res.detail.userInfo){ // 返回的信息中包含用户信息则证明用户允许获取信息授权
      console.log('授权成功')
    
      Taro.login()
        .then(resLogin => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (resLogin.code){
            // 登录
            console.log(resLogin.code)
            this.props.dispatch({
              type: 'login/wxCode2Session',
              payload: resLogin.code
            }).then(()=>{
              console.log('login result')
            })
          }
        })
    } else {
      Taro.showToast({
        title: '微信登录失败',
        icon: 'error',
        duration: 1000
      })
    }
  }

  render() {
    return (
      <View className='page'>
        <View className='login'>
          <View class='copyright-info'>
            <Image src={Logo} style='width: 158px;height: 20px;'></Image>
            <View class='siteurl'>www.epanel.cn</View>
          </View>
          <View class='loginbutton'>
            <AtButton type='primary' circle 
            openType='getUserInfo'
            onGetUserInfo={this.handleWeappLogin}>微信登录</AtButton>
          </View>
          <View class='loginbutton'>
            <AtButton onClick={this.handleForm} circle>云调查登录</AtButton>
          </View>
        </View>
      </View>
    )
  }
}

export default Index;

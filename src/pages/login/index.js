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

class Login extends Component {
  config = {
    navigationBarTitleText: '云调查',
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount = () => {
    const token = this.props.token || Taro.getStorageSync('token')
    const logintime = Taro.getStorageSync('logintime')
    let now =  new Date().valueOf()
    let duration = now - logintime
    
    if (!!token && duration < 1000*60*60) {
      Taro.redirectTo({ url: '/pages/home/index' })
      return
    }
  };
  
  handleForm = () => {
    Taro.navigateTo({
      url: '/pages/login/formlogin'
    })
  }

  errorMessage = (msg) => {
    Taro.atMessage({
      'message': msg,
      'type': 'error'
    })
  }
  
  handleWxLogin = () => {
    let encryptedData = ''
    let iv = ''
    Taro.login()
      .then(r => {
        var code = r.code // 登录凭证
        if (code) {
          // 调用获取用户信息接口
          Taro.getUserInfo({
            success: function (res) {
              encryptedData = res.encryptedData
              iv = res.iv    
            }
          }).then(()=>{
            let params = { encryptedData: encryptedData, iv: iv, code: code }
            if (!!encryptedData && !!iv) {
              this.props.dispatch({
                type: 'login/wxLogin',
                payload: params
              })
            } else {
              this.errorMessage('微信获取用户信息失败')
            }
          }) 
        } else {
          this.errorMessage('微信授权登录失败')
        }
      })
  }

  render() {
    return (
      <View className='page'>
        <View className='login'>
          <View class='copyright-info'>
            <Image src={Logo} style='width: 158px;height: 20px;'></Image>
            <View class='siteurl'>www.epanel.cn</View>
          </View>
          {process.env.TARO_ENV === 'weapp' && <View class='loginbutton'>
            <AtButton type='primary' circle openType='getUserInfo' onGetUserInfo={this.handleWxLogin}>微信注册/登录</AtButton>
          </View>}
          <View class='loginbutton'>
            <AtButton onClick={this.handleForm} circle>云调查登录</AtButton>
          </View>
        </View>
      </View>
    )
  }
}

export default Login;

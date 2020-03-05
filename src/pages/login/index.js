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
    if(this.props.token){
      Taro.redirectTo({
        url: '../home/index'
      })
    }
  };
  
  handleForm = () => {
    Taro.navigateTo({
      url: '/pages/login/formlogin'
    })
  }
  
  handleWx = () => {
    console.log('open wx')
  }

  render() {
    return (
      <View className="page">
        <View className="login">
          <View class="copyright-info">
            <Image src={Logo} style='width: 158px;height: 20px;'></Image>
            <View class="siteurl">www.epanel.cn</View>
          </View>
          <View class="loginbutton">
            <AtButton type="primary" circle onClick={this.handleWx}>微信登录</AtButton>
          </View>
          <View class="loginbutton">
            <AtButton onClick={this.handleForm} circle>云调查登录</AtButton>
          </View>
        </View>
      </View>
    )
  }
}

export default Index;

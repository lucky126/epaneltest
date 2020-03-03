import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({login}) => ({
  ...login,
}))

class FormLogin extends Component {
  config = {
    navigationBarTitleText: '云调查登录',
  };

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  componentDidMount = () => {

  };


  render() {
    return (
      <View className="index-page">
        <AtInput
        name='username'
        title='账户'
        type='text'
        placeholder='请输入手机号/邮箱'
        value={this.state.username}
      />
        <AtInput
        name='password'
        title='密码'
        type='password'
        placeholder='请输入密码'
        value={this.state.password}
      />
       <AtButton type="primary" circle="true">立即登录</AtButton>
      </View>
    )
  }
}

export default FormLogin;

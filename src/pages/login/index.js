import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({login}) => ({
  ...login,
}))

class Index extends Component {
  config = {
    navigationBarTitleText: 'index',
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {

  };

  render() {
    return (
      <View className="index-page">
         <view class="copyrightinfo">
          <cover-image src="../../assert/images/logo.png"></cover-image>
          <view class="siteurl">www.epanel.cn</view>
        </view>
        <view class="wechatlogin">
          <button type="primary" bindtap="openwx">微信登录</button>   
          <button bindtap="openform">云调查登录</button>
        </view>
      </View>
    )
  }
}

export default Index;

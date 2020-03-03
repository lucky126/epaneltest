import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({home}) => ({
  ...home,
}))
class Index extends Component {
  config = {
    navigationBarTitleText: 'home',
  };

  componentDidMount = () => {

  };

  render() {
    return (
      <View className="home-page">
        home
      </View>
    )
  }
}

export default Index;
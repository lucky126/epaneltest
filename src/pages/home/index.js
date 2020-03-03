import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtButton } from 'taro-ui'

@connect(({home}) => ({
  ...home,
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
        <AtButton type='primary'>按钮文案</AtButton>
      </View>
    )
  }
}

export default Index;

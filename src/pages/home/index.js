import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtButton } from 'taro-ui'

@connect(({home, common}) => ({
  ...home,
  ...common
}))

class Index extends Component {
  config = {
    navigationBarTitleText: '问卷列表',
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {
    if(!this.props.token){
      Taro.redirectTo({
        url: '../login/index'
      })
    }
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

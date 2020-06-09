import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';

@connect(({project}) => ({
  ...project,
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
      <View className='page'>
        index
      </View>
    )
  }
}

export default Index;

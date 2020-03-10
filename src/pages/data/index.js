import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtNavBar } from 'taro-ui'

@connect(({data}) => ({
  ...data,
}))

class Data extends Component {
  config = {
    navigationBarTitleText: '分析下载',
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
      
      </View>
    )
  }
}

export default Data;

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'

class Chartdata extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  render() {
    const { data } = this.props

    return (
      <View className='chartData-wrap'>
      </View>
    )
  }
}

export default Chartdata

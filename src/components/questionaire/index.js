import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import PropTypes from 'prop-types';
import moment from 'moment';
import './index.scss'

class Questionaire extends Component {
  static propTypes = {
    qtn: PropTypes.object
  };

  static defaultProps = {
    qtn: '',
  };

  render() {
    const { qtn, qtnTypes } = this.props;

    return (
      <View className='questionaire-wrap'>
        <View className='InfoRow'>
          <View className='titleRow'>（ID: {qtn.id}) {qtn.qtnTitle}</View>
          <View className='dataRow'>
            <Text>{moment(qtn.createTime).format('YYYY-MM-DD')} </Text>
            <Text className='collect'>收集数据：<Text className='finishNum'>{qtn.finishNum}</Text></Text>
          </View>
          <View className='typeRow'>
            <Text className='typeName'>{qtnTypes[qtn.qtnType]}</Text>
          </View>
        </View>
        <View className='optRow'>{qtn.statusDescn}</View>
      </View>
    )
  }
}

export default Questionaire

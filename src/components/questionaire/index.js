import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types';
import moment from 'moment';

import u190 from '../../assets/images/u190.png'
import u192 from '../../assets/images/u192.png'
import u198 from '../../assets/images/u198.png'
import u210 from '../../assets/images/u210.png'
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
        <View className='optRow at-row'>
          <View className='at-col at-col-6'>{qtn.statusDescn}</View>
          <View className='at-col at-col-2'>
            <Image src={u190} style='width:25px;height:25px;' onClick={this.handle} />
          </View>
          <View className='at-col at-col-2'>
            <Image src={u210} style='width:25px;height:25px;' onClick={this.handle} />
          </View>
          <View className='at-col at-col-2'>
            <Image src={u198} style='width:25px;height:25px;' onClick={this.handle} />
          </View>
        </View>
      </View>
    )
  }
}

export default Questionaire

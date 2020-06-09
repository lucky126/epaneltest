import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui';
import PropTypes from 'prop-types';
import { formatOnlyDate } from '../../utils/common'
import './index.scss'

class Project extends Component {
  static propTypes = {
    prj: PropTypes.object
  };

  static defaultProps = {
    prj: '',
  };

  render() {
    const { prj, qtnTypes } = this.props;

    return (
      <View className='Project-wrap'>
        <View className='InfoRow'>
          <View className='titleRow'>（ID: {prj.id}) {prj.prjName}</View>
          <View className='dataRow'>
            <Text>{formatOnlyDate(prj.createTime)} </Text>
            <Text className='collect'>外部问卷：<Text className='finishNum'>{prj.prjFlag == 1 ? '使用' : '不使用'}</Text></Text>
          </View>
          <View className='typeRow'>
            <Text className='typeName'>{qtnTypes[prj.prjType]}</Text>
          </View>
        </View>
        <View className='optRow at-row'>
          <View className='at-col at-col-6'>
            <Text className='statusDesc'>{prj.statusDescn}</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Project

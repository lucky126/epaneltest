import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import PropTypes from 'prop-types';
import { formatOnlyDate } from '../../utils/common'
import { AtIcon } from 'taro-ui';

import './index.scss'

class Questionaire extends Component {
  static propTypes = {
    qtn: PropTypes.object
  };

  static defaultProps = {
    qtn: '',
  };

  handleEdit = (id) => {
    // console.log('edit ' + id)
  }
  handleShow = (id) => {
    // console.log('show ' + id)
  }

  handleData = (id) => {
    Taro.navigateTo({
      url: '/pages/data/index?id=' + id
    })
  }

  handleInvitation = (id) => {
    Taro.navigateTo({
      url: '/pages/invitation/index?id=' + id
    })
  }

  render() {
    const { qtn, qtnTypes } = this.props;

    let ftAction = this.handleShow.bind(this, qtn.id)
    if (qtn.status === 0) {
      ftAction = this.handleEdit.bind(this, qtn.id)
    }

    return (
      <View className='questionaire-wrap'>
        <View className='InfoRow'>
          <View className='titleRow'>（ID: {qtn.id}) {qtn.qtnTitle}</View>
          <View className='dataRow'>
            <Text>{formatOnlyDate(qtn.createTime)} </Text>
            <Text className='collect'>收集数据：<Text className='finishNum'>{qtn.finishNum}</Text></Text>
          </View>
          <View className='typeRow'>
            <Text className='typeName'>{qtnTypes[qtn.qtnType]}</Text>
          </View>
        </View>
        <View className='optRow at-row'>
          <View className='at-col at-col-6'>{qtn.statusDescn}</View>
          <View className='at-col at-col-2'>
            {qtn.status == 0 ?
              (<AtIcon value='edit' size='20' onClick={ftAction} ></AtIcon>)
              : (<AtIcon value='eye' size='20' onClick={ftAction} ></AtIcon>)}
          </View>
          <View className='at-col at-col-2'>
            <AtIcon value='share' size='20' onClick={this.handleInvitation.bind(this, qtn.id)} ></AtIcon>
          </View>
          <View className='at-col at-col-2'>
            <AtIcon value='analytics' size='20' onClick={this.handleData.bind(this, qtn.id)}></AtIcon>
          </View>
        </View>
      </View>
    )
  }
}

export default Questionaire

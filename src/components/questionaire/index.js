import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui';
import PropTypes from 'prop-types';
import cx from 'classnames'
import { formatOnlyDate } from '../../utils/common'

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
          <View className='at-col at-col-6'>
            <Text className="statusDesc">{qtn.statusDescn}</Text>
            <Text className={cx({
              statusDescDot_default: qtn.status === 0,
              statusDescDot_run: qtn.status === 2,
              statusDescDot_stop: qtn.status == 5
            })}>●</Text>
            <Text className="seperator"> </Text>
            {/* 开启操作，只有0，5状态才可以，目标状态2 */}
            {(qtn.status == 0 || qtn.status == 5) && (<AtIcon value='play' size='20' onClick={ftAction} ></AtIcon>)}
            <Text className="seperator"> </Text>
            {/* 暂停操作，执行中2才可以，目标状态0 */}
            {qtn.status == 2 && (<AtIcon value='pause' size='20' onClick={ftAction} ></AtIcon>)}
            <Text className="seperator"> </Text>
            {/* 停止操作，执行中2才可以，目标状态5 */}
            {qtn.status == 2 && (<AtIcon value='stop' size='20' onClick={ftAction} ></AtIcon>)}
          </View>
          <View className='at-col at-col-3'></View>
          <View className='at-col at-col-2'>
            <AtIcon value='share' size='20' onClick={this.handleInvitation.bind(this, qtn.id)} ></AtIcon>
          </View>
          <View className='at-col at-col-1'>
            <AtIcon value='analytics' size='20' onClick={this.handleData.bind(this, qtn.id)}></AtIcon>
          </View>
        </View>
      </View>
    )
  }
}

export default Questionaire

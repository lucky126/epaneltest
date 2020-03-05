import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
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
    const { qtn } = this.props;
    return (
      <View className='questionaire-wrap'>
        <View className="InfoRow">
          <View className="title">（ID: {qtn.id}) {qtn.qtnTitle}</View>
          <View className="dateRow">{moment(qtn.createTime).format("YYYY-MM-DD")} 收集数据：{qtn.finishNum}</View>
          <View className="type">{qtn.qtnType}</View>
        </View>
        <View className="optRow">{qtn.statusDescn}</View>
      </View>
    )
  }
}

export default Questionaire

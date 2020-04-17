import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import cx from 'classnames'
import PropTypes from 'prop-types';
import './index.scss'

class Chartopttable extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  render() {
    const { qt, items, isEmpty } = this.props

    return (
      <View className='ChartOptTable-wrap'>
        <View className='data'>
          {!isEmpty && (
            <View className='table'>

              <View className='tr'>
                <View className='th right'>序号</View>
                <View className='th right'>选项内容</View>
                <View className='th right'>计数</View>
                <View className='th'>百分比</View>
              </View>

              {qt.items.map((opt, key) => (
                <View className={cx({
                  alter: key % 2 != 0,
                  tr: true
                })} key={opt.optMySeq}>
                  <View className='td right'>{key + 1}</View>
                  <View className='td right'>
                    {opt.label}
                  </View>
                  <View className='td right'>{opt.count}</View>
                  <View className='td right'>{opt.percent}</View>
                </View>
              ))}

            </View>
          )}
          
        </View>
        <View className='num'>
            答题人数：
          {qt.count}
          </View>
      </View>
    )
  }
}

export default Chartopttable

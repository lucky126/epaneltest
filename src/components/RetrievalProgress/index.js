import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

class RetrievalProgress extends Component {

  render() {
    let { RetrievalProgress } = this.props
    console.log(RetrievalProgress)
    return (
      <View className='progress-wrap'>
        <View className='at-row at-row__justify--center'>
          <View className='at-col at-col-5 dataRow'>
            <View className='dataItem'>
              {RetrievalProgress.retrieveTotal || 0}
              <Text className="small">
                /{RetrievalProgress.targetTotal || 0}
              </Text>
            </View>
            <View className='infoItem'>回收总量/目标总量</View>
          </View>
          <View className='at-col at-col-5 dataRow'>
            <View className='dataItem'>{RetrievalProgress.visitTotal || 0}</View>
            <View className='infoItem'>问卷访问总量</View>
          </View>
        </View>

        <View className='at-row at-row__justify--center'>
          <View className='at-col at-col-5 dataRow'>
            <View className='dataItem'>{RetrievalProgress.dayRetrieveNum || 0}</View>
            <View className='infoItem'>今日回收量</View>
          </View>
          <View className='at-col at-col-5 dataRow'>
            <View className='dataItem'>{RetrievalProgress.retrieveRate}</View>
            <View className='infoItem'>回收完成率</View>
          </View>
        </View>
      </View>
    )
  }
}

export default RetrievalProgress

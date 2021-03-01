import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux';
import { View, Text } from '@tarojs/components'
import { AtButton, AtMessage } from 'taro-ui'
import cx from 'classnames'
import { formatOnlyDate } from '../../utils/common'
import './index.scss'
import {MAINHOST} from '../../config/index'

@connect(({ data, common }) => ({
  ...data,
  ...common
}))

class AnswerData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 2,
      pageSize: 20,
      status: null,
      startTime: null,
      endTime: null,
    }
    this.exportExcelData = this.exportExcelData.bind(this)
    this.export = this.export.bind(this)
  }
  // 导出
  exportExcelData() {
    Taro.showLoading({
      title: '导出中...',
      mask: true
    })
    const { qtnId } = this.props
    this.props.dispatch({
      type: 'data/exportExcelData',
      payload: {
        endTime: null,
        qtnId,
        startTime: null,
        status: null
      }
    }).then(() => {
      const { exportResponse } = this.props
      this.export(exportResponse)
      // Taro.hideLoading()
    })
  }
  export(response) {
    const taskId = response.message.data.taskId
    this._timer = setInterval(() => {
      try{
        this.props.dispatch({
          type: 'data/getTaskInfo',
          payload: { taskId }
        }).then(() => {
          const { response } = this.props
          const status = response.message.data.taskInfo.status;
          if (status == 2) {
            const taskId = response.message.data.taskInfo.id;
            const outputMessageData = response.message.data.taskInfo.outputMessageData;
            this.props.dispatch({
              type: 'data/updTaskStatus',
              payload: { taskId }
            }).then(() => {
              // 下载
              Taro.downloadFile({
                url: MAINHOST +'/v2/service/download/' + outputMessageData,
                complete: (res) => {
                  console.log('调完了', res)
                  if (res.statusCode == 200) {
                    Taro.saveFile({
                      tempFilePath: res.tempFilePath,
                      success: (res) => {
                        console.log('kkk', res)
                      }
                    })
                  }
                }
              })
              // utils.download(outputMessageData);
              Taro.hideLoading()
              clearInterval(this._timer);
            })
          }
          if (status == 3) {
            Taro.hideLoading()
            Taro.atMessage({
              'message': '导出失败',
              'type': 'error',
            })
            clearInterval(this._timer);
          }
        })
      } catch (e) {
        Taro.hideLoading()
        Taro.atMessage({
          'message': '导出失败',
          'type': 'error',
        })
        clearInterval(this._timer);
      }
    }, 4000);
  }

  render() {
    const { data, onShowResult, view } = this.props
    return (
      <View className='answerData-wrap'>
        <AtMessage />
        <View className="btn">
          <AtButton type='primary' size='small' onClick={this.exportExcelData}>导出表格</AtButton>
        </View>
        <View className='table'>
          <View className='tr'>
            <View className='th'>答题序号</View>
            <View className='th'>答题状态</View>
            <View className='th'>结束时间</View>
            <View className='th'>操作</View>
          </View>

          {data && data.map((item, index) => (
            <View className='tr' key={item.resultId}>
              <View className='td'>{item.resultId}</View>
              <View className={cx({
                finish: item.status === 29,
                answering: item.status === 20,
                other: item.status !== 29 && item.status !== 20,
                td: true
              })}>
                {item.answerStatusDescn}
              </View>
              <View className='td'>{item.endTime ? formatOnlyDate(item.endTime) : '--'}</View>
              <View className='td'><Text onClick={onShowResult.bind(this, item.resultId, index, view)}>查看</Text></View>
            </View>
          ))}

        </View>
      </View>
    )
  }
}

export default AnswerData
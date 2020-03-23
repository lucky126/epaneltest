import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import Answeroptlist from '../../components/AnswerOptList';

@connect(({ data, common }) => ({
  ...data,
  ...common
}))

class AnswerDetail extends Component {
  config = {
    navigationBarTitleText: '答题详情',
  };

  constructor(props) {
    super(props)
    this.state = {
      qtnId: 0,
      resultId: 0
    }
  }

  componentDidMount = () => {
    this.setState({
      qtnId: this.$router.params.qtnId,
      resultId: this.$router.params.rid,
    });

    this.getData(this.$router.params.qtnId, this.$router.params.rid)
  };

  getData = (qtnId, resultId) => {
    //获得问卷进度数据
    this.props.dispatch({
      type: 'data/getAnswerResultById',
      payload: { qtnId, resultId },
      token: this.props.token
    })
  }


  render() {
    const { answerInfo, panelInfo } = this.props
    const { resultId } = this.state

    return (
      <View className='page'>
        <View className='at-panel answerInfo'>
          <View className='panel__title'>样本信息</View>
          <View className='panel__content no-padding'>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>答题编号：</View>
              <View className='at-col at-col-8'>{resultId}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>答题状态：</View>
              <View className='at-col at-col-9'>{panelInfo.answerStatusDescn || '--'}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>开始时间：</View>
              <View className='at-col at-col-9'>{panelInfo.startTime || ''}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>浏览器：</View>
              <View className='at-col at-col-9'>{panelInfo.browser || '--'}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>样本昵称：</View>
              <View className='at-col at-col-9'>{panelInfo.nikeName || '--'}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>答题来源：</View>
              <View className='at-col at-col-9'>{panelInfo.answerSource || '--'}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>结束时间：</View>
              <View className='at-col at-col-9'>{panelInfo.endTime ? (panelInfo.endTime || '') : '--'}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>操作系统：</View>
              <View className='at-col at-col-9'>{panelInfo.platform || '--'}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>答题设备：</View>
              <View className='at-col at-col-9'>{panelInfo.answerDevice || '--'}</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>答题时长：</View>
              <View className='at-col at-col-9'>{panelInfo.answerDuration
                ? Math.ceil(panelInfo.answerDuration / 60)
                : '--'} (分)</View>
            </View>
            <View className='at-row panelInfoLine'>
              <View className='at-col at-col__offset-1 at-col-3 leftInfo'>用户IP：</View>
              <View className='at-col at-col-9'>{panelInfo.ip || '--'}</View>
            </View>
          </View>
        </View>
        <View className='at-panel answerInfo'>
          <View className='panel__title'>答题信息</View>
          <View className='panel__content no-padding'>
            {answerInfo.map((doc, index) => (
              <View className='anwQuestion' key={index || 0}>
                <View className='at-row' >
                  <View className='at-col at-col__offset-1 qtDesc'>{doc.qtDescn}</View>
                </View>
                {
                  doc.subList ? (
                    <View></View>
                  ) : doc.type === 2 ? (
                    <View></View>
                  ) : (
                    <Answeroptlist optList={doc.optList || []} />
                 )}
              </View>
            ))}

          </View>
        </View>
      </View>
    )
  }
}

export default AnswerDetail;

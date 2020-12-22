import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui';
import PropTypes from 'prop-types';
import cx from 'classnames'
import { connect } from '@tarojs/redux';
import { formatOnlyDate } from '../../utils/common'

import './index.scss'

@connect(({ edit }) => ({
  ...edit
}))
class Questionaire extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showmore: false,
    }
    this.more = this.more.bind(this)
    this.onShowModeal = this.onShowModeal.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
  }
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

  handleData = (id, canData) => {
    const { prjId, view } = this.props;

    let extQuery = ''
    //项目内如果可以访问数据，则默认进入数据tab
    if (prjId && canData) {
      extQuery = '&current=1'
    }
    let newView = view
    //如果项目不能访问数据，则说明不能删除，即只读
    if (prjId && !canData) {
      newView = true
    }

    Taro.navigateTo({
      url: '/pages/data/index?id=' + id + '&view=' + newView + extQuery
    })
  }

  handleInvitation = (id, canLink, canSetInv, qtnType) => {
    const { prjId, view } = this.props;
    //设定开放连接查看权限
    let extQuery = '&canLink=' + canLink + '&canSetInv=' + canSetInv
    
    Taro.navigateTo({
      url: '/pages/invitation/index?id=' + id + '&view=' + view + extQuery + '&qtnType=' + qtnType
    })
  }

  handleShow = (id) => {
    Taro.navigateTo({
      url: '/pages/home/show?id=' + id
    })
  }

  handleEdit =(id,canLink, canSetInv) => {
    const { view } = this.props;
    let extQuery = '&view=' + view + '&canLink=' + canLink + '&canSetInv=' + canSetInv
    this.props.dispatch({
      type: 'edit/save',
      payload: {
        extQuery
      },
    });
    Taro.navigateTo({
      url: '/pages/edit/index?id=' + id
    })
  }
  more(item) {
    const {showmore} = this.state
    this.setState({showmore: !showmore})
    this.props.changeId(item.id)
  }
  // 复制
  onShowModeal(qtn) {
    this.props.copy(qtn)
  }
  // 删除
  showConfirm(qtn) {
    this.props.delete(qtn)
  }

  render() {
    const { qtns, index, qtnTypes, onChangeStatus, prjFlag, prjId, selectid } = this.props;
    const {showmore} = this.state

    // let ftAction = this.handleShow.bind(this, qtn.id)
    // if (qtn.status === 0) {
    //   ftAction = this.handleEdit.bind(this, qtn.id)
    // }
    //非项目问卷默认可以显示预览
    let canShow = !prjId
    let canSetInv = !prjId
    let canLink = !prjId
    let canData = !prjId
    let canProgress = !prjId

    if (prjId) {
      qtns.tasks.map((task) => {
        //项目问卷type=1 题目制作有权限则可以预览
        if (task.taskType === 1 && task.operates && task.activated) {
          canShow = true
        }
        //项目问卷type=5 数据权限有则可以获得分析权限
        if ((task.taskType === 5) && task.operates && task.activated) {
          canData = true
        }
        //项目问卷type=6 进度权限有则可以获得分析权限
        if ((task.taskType === 6) && task.operates && task.activated) {
          canProgress = true
        }
        //项目问卷type=2 收集设置有则可以获得收集设置
        if ((task.taskType === 2) && task.operates && task.activated) {
          canSetInv = true
        }
        //项目问卷type=4 问卷收集有则可以获得开放链接
        if ((task.taskType === 4) && task.operates && task.activated) {
          canLink = true
        }
      })
    }

    return (
      <View className='questionaire-wrap'>
        <View className='InfoRow'>
          <View className='titleRow'>
            <View>
              （ID: {qtns.id}）{qtns.qtnTitle.replace(/<[^>]+>/g,"")}
            </View>
            <View className='statusDesc'>{qtns.statusDescn}
              <Text className={cx({
                statusDescDot_default: qtns.status === 0,
                statusDescDot_run: qtns.status === 2,
                statusDescDot_stop: qtns.status == 5
              })}
              >●</Text>
            </View>
          </View>
          <View className='dataRow'>
            <Text>{formatOnlyDate(qtns.createTime)} </Text>
            <Text className='collect'>收集数据：<Text className='finishNum'>{qtns.finishNum}</Text></Text>
          </View>
          <View className='typeRow'>
            <Text className='typeName'>{qtnTypes[qtns.qtnType]}</Text>
            {prjFlag === 1 && (<Text className='type'>类型：<Text>{qtns.whatQtn === 2
              ? "前置"
              : qtns.whatQtn === 4
                ? "后置"
                : "外部"}</Text></Text>)}
          </View>
        </View>
        <View className='optRow at-row at-row__justify--between'>
          <View className='at-col at-col-4' style={{marginRight:'10px'}}>
          {qtns.qtnType != 80 && qtns.qtnType != 90 && (
            <View>
            {!!!prjId && (<Text className='seperator'> </Text>)}
            {/* 开启操作，只有0，5状态才可以，目标状态2 */}
            {!!!prjId && (qtns.status == 0 || qtns.status == 5) && (
              <AtIcon value='play' size='15' onClick={onChangeStatus.bind(this, `${qtns.id}`, `${index}`, `${qtns.status}`, 2)} ></AtIcon>)}
            {!!!prjId && (qtns.status == 0 || qtns.status == 5) && (<Text onClick={onChangeStatus.bind(this, `${qtns.id}`, `${index}`, `${qtns.status}`, 2)}>开启</Text>)}
            {/* 暂停操作，执行中2才可以，目标状态0 */}
            {!!!prjId && qtns.status == 2 && (<AtIcon value='pause' size='15' color='#108ee9'  onClick={onChangeStatus.bind(this, `${qtns.id}`, `${index}`, `${qtns.status}`, 0)} ></AtIcon>)}
            {!!!prjId && qtns.status == 2 && (<Text onClick={onChangeStatus.bind(this, `${qtns.id}`, `${index}`, `${qtns.status}`, 0)}>暂停</Text>)}
            {!!!prjId && (<Text className='seperator'> </Text>)}
            {/* 停止操作，执行中2才可以，目标状态5 */}
            {!!!prjId && qtns.status == 2 && (<AtIcon value='stop' size='15' color='#108ee9'  onClick={onChangeStatus.bind(this, `${qtns.id}`, `${index}`, `${qtns.status}`, 5)} ></AtIcon>)}
            {!!!prjId && qtns.status == 2 && (<Text onClick={onChangeStatus.bind(this, `${qtns.id}`, `${index}`, `${qtns.status}`, 5)}>关闭</Text>)}
          </View>
          )}
          </View>
          <View className='more at-col at-col-1 at-col--auto r-btn'>
            {qtns.qtnType != 80 && qtns.qtnType != 90 && canShow && (
              <View className='function'>
                <AtIcon value='file-generic' size='15' color='#108ee9' onClick={this.handleShow.bind(this, qtns.id)} ></AtIcon>
                <Text onClick={this.handleShow.bind(this, qtns.id)}>预览</Text>
              </View>
            )}
            {(canData || canProgress) && (
              <View className='function'>
                <AtIcon value='analytics' size='15' color='#108ee9' onClick={this.handleData.bind(this, qtns.id, canData)}></AtIcon>
                <Text onClick={this.handleData.bind(this, qtns.id, canData)}>分析</Text>
              </View>
            )}
            {qtns.qtnType != 80 && qtns.qtnType != 90 && (
              <View onClick={() => this.more(qtns)}>
                <AtIcon value='menu' size='15' color='#108ee9'></AtIcon>
                <Text>更多</Text>
              </View>
            )}
            {showmore && selectid == qtns.id && (
              <View className='more-info'>
                {qtns.qtnType != 80 && qtns.qtnType != 90 && (
                  <View className='more-function' onClick={() => this.onShowModeal(qtns)}>
                    <AtIcon value='file-new' size='15' color='#108ee9'></AtIcon>
                    <Text>复制</Text>
                  </View>
                )}
                {qtns.qtnType != 80 && qtns.qtnType != 90 && (
                  <View className='more-function' onClick={() => this.showConfirm(qtns)}>
                    <AtIcon value='trash' size='15' color='#108ee9'></AtIcon>
                    <Text>删除</Text>
                  </View>
                )}
                {qtns.qtnType != 80 && qtns.qtnType != 90 && !!!prjId && (qtns.status == 0) && (
                  <View className='more-function'>
                    <AtIcon value='edit' size='15' color='#108ee9' onClick={this.handleEdit.bind(this, qtns.id)} ></AtIcon>
                    <Text onClick={this.handleEdit.bind(this, qtns.id, canLink, canSetInv)}>编辑</Text>
                  </View>
                )}
                {qtns.qtnType != 80 && qtns.qtnType != 90 && (canLink || canSetInv) && (
                  <View className='more-function'>
                    <AtIcon value='settings' size='15' color='#108ee9' onClick={this.handleInvitation.bind(this, qtns.id, canLink, canSetInv)} ></AtIcon>
                    <Text onClick={this.handleInvitation.bind(this, qtns.id, canLink, canSetInv)}>设置</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}

export default Questionaire

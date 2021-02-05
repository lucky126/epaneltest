import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabs, AtTabsPane, AtNavBar, AtButton, AtTextarea, AtMessage, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtRadio, AtList, AtListItem } from 'taro-ui'
import { BeginToCollect } from '../../components/beginToCollect'
import { Quota } from '../../components/Quota'
import { Link } from '../../components/link'
import{data} from './data'
import { Tree } from './tree'
import './index.scss';

@connect(({ invitation, home, common }) => ({
  ...invitation,
  ...home,
  ...common
}))

class Invitation extends Component {
  config = {
    navigationBarTitleText: '收集数据',
  };

  constructor(props) {
    super(props)
    this.state = {
      uniqueId: [],
      UserContactsVo: [],
      timeSel: '',
      dateSel: '',
      isOpened: false,
      sendType: '',
      value: '',
      step: 1,
      selectedList: [], // 选中的人
      current: 2,
      qtnId: 0,
      view: false,
      canLink: true,
      canSetInv: true
    }
    this.change = this.change.bind(this)
    this.toNext = this.toNext.bind(this)
    this.textareaChange = this.textareaChange.bind(this)
    this.cancel = this.cancel.bind(this)
    this.sendTypeChange = this.sendTypeChange.bind(this)
    this.send = this.send.bind(this)
    this.getSendList = this.getSendList.bind(this)
    this.getContent = this.getContent.bind(this)
  }

  componentWillMount() {
    this.setState({
      qtnId: this.$router.params.id,
      view: this.$router.params.view === 'true',
      canLink: this.$router.params.canLink === 'true',
      canSetInv: this.$router.params.canSetInv === 'true'
    });
    this.getData(this.$router.params.id)
    this.getTreeData()
    this.getSendList()
    this.getContent()
  };
  // 获取发送消息内容
  getContent() {
    this.props.dispatch({
      type: 'invitation/getContent',
      payload: {qtnId: this.state.qtnId},
    })
  }
  // 获取名单
  getTreeData() {
    this.props.dispatch({
      type: 'invitation/TreePrivatization',
      payload: {},
    })
  }
  getData(qtnId) {
    this.props.dispatch({
      type: 'home/getQuestionnaireName',
      payload: { qtnId },
      token: this.props.token
    })
    //获得问卷发布状态
    this.props.dispatch({
      type: 'invitation/statusCheck',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      // console.log('get statusCheck')
      if (this.props.qtnStatus !== 0) {
        this.getWebLink(qtnId)
      }
    })
    //获取配额列表信息
    this.props.dispatch({
      type:'PanelQuota/getQtnQuota',
      payload: { qtnId },
      token: this.props.token
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  handleSetting = () => {
    const { qtnId, view } = this.state

    Taro.navigateTo({
      url: '/pages/invitation/collect?id=' + qtnId + '&view=' + view
    })
  }

  handleNothing = () => { }

  beginRetrieveData = () => {
    const { qtnId } = this.state

    // 更新问卷发布状态
    this.props.dispatch({
      type: 'invitation/beginRetrieve',
      payload: { qtnId },
      token: this.props.token
    }).then(()=>{
      this.getWebLink(qtnId)
    })
  }

  getWebLink(id) {
    // 获取问卷链接和二维码地址
    this.props.dispatch({
      type: 'invitation/getWebLink',
      payload: { qtnId: id },
      token: this.props.token
    })

  }
  // 获取已发送列表
  getSendList() {
    const { qtnId } = this.state
    this.props.dispatch({
      type: 'invitation/getSendList',
      payload: { qtnId },
      token: this.props.token
    }).then(() => {
      const { sendList } = this.props
      if (sendList.length == 0) {
        this.setState({step: 1})
      }
    })
  }
  // 选择的人
  change(values, current) {
    Taro.showLoading({
      title: '加载中',
    })
    const { selectedList } = this.state
    var list = JSON.parse(JSON.stringify(selectedList)) // 选框绑定的值
    var uniqueIds = JSON.parse(JSON.stringify(this.state.uniqueId)) // ids
    var UserContactsVos = JSON.parse(JSON.stringify(this.state.UserContactsVo)) // 详细数据
    var lop = (arr, id) => {
      if(arr.length) {
        arr.forEach((j, key) => {
          var a = JSON.parse(JSON.stringify(j))
          if (selectedList.length > values.length) { // 取消选中
            var index1 = list.findIndex(aa => aa == JSON.stringify(a))
            list.splice(index1, 1)
            uniqueIds.splice(index1, 1)
            if (a.userid) {
              UserContactsVos.splice(UserContactsVos.findIndex(aa => aa.userId == a.userid && aa.uniqueId == a.str), 1)
            } else {
              lop(a.children, a.id)
              lop(a.userList, a.id)
            }
          } else {
            if (j.userid) {
              let str = id + '_' + key
              a.str = str
              list.push(JSON.stringify(a))
              UserContactsVos.push({
                email: j.email,
                mobile: j.mobile,
                userId: j.userid,
                name: j.name,
                uniqueId: str,
                department: j.department
              })
              uniqueIds.push(str)
            } else {
              a.str = a.id
              list.push(JSON.stringify(a))
              lop(j.children, j.id)
              lop(j.userList, j.id)
            }
          }
        })
      }
    }
    if (selectedList.length > values.length) { // 取消选中
      let value = JSON.parse(JSON.stringify(current))
      var index1 = list.findIndex(a => a == JSON.stringify(value))
      list.splice(index1, 1)
      uniqueIds.splice(index1, 1)
      if (value.userid) {
        UserContactsVos.splice(UserContactsVos.findIndex(a => a.userId == value.userid && a.uniqueId == value.str), 1)
      } else {
        lop(value.children, value.id)
        lop(value.userList, value.id)
      }
    } else {
      let i = values[values.length-1]
      let value = JSON.parse(i)
      list.push(i)
      uniqueIds.push(value.str)
      if (value.userid) {
        UserContactsVos.push({
          email: value.email,
          mobile: value.mobile,
          userId: value.userid,
          name: value.name,
          uniqueId: value.str,
          department: value.department
        })
      } else {
        lop(value.children, value.id)
        lop(value.userList, value.id)
      }
    }
    this.setState({ selectedList: list, uniqueId: uniqueIds, UserContactsVo: UserContactsVos }, () => {
      Taro.hideLoading()
    })
  }
  // 下一步
  toNext(step) {
    if(step == 0) {
      this.setState({step: 1})
    }else if(step == 1) {
      if(!this.state.selectedList.length) {
        Taro.atMessage({message: '请选择联系人', type: 'error'})
        return
      }
      this.setState({step: 2})
    } else if(step == 2) {
      const { content } = this.props
      if (!content) {
        Taro.atMessage({ message: '消息内容不能为空', type: 'error' })
        return
      }
      this.setState({ isOpened: true })
    } else if(step == -1) {
      this.setState({step: this.state.step - 1})
    }
  }
  // 发送的文本
  textareaChange(e) {
    this.props.dispatch({
      type: 'invitation/save',
      payload: { content: e.detail.value },
    })
  }
  // 取消
  cancel () {
    this.setState({ isOpened: false, sendType: '' })
  }
  // 发送方式
  sendTypeChange(value) {
    this.setState({ sendType: value })
  }
  // 最后发送
  send() {
    // const { sendType } = this.state
    // if (!sendType) {
    //   Taro.atMessage({ message: '请选择发送方式', type: 'error' })
    //   return
    // }
    const { UserContactsVo, uniqueId, qtnId } = this.state
    const { content } = this.props
    this.props.dispatch({
      type: 'invitation/send',
      payload: { 
        qtnId,
        UserContactsVo,
        uniqueId,
        content
      }
    }).then(() => {
      this.setState({ isOpened: false, step: 0, UserContactsVo: [], uniqueId: [] })
      this.getSendList()
    })
  }
  onTimeChange = e => {
    this.setState({
      timeSel: e.detail.value
    })
  }
  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    })
  }
  timeCancel = () => {

  }

  onShareAppMessage(res) {
    const { qtnName, linkData } = this.props

    let weblinkUrl = linkData ? linkData.weblinkUrl : ''

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: qtnName + '--云调查',
      path: '/pages/invitation/answer?url=' + encodeURI(weblinkUrl),
      imageUrl: 'https://www.epanel.cn/images/answer.jpg'
    }
  }

  render() {
    const { canLink, canSetInv, selectedList, step, isOpened, UserContactsVo } = this.state
    const { qtnStatus, linkData, qtnName, QuotaList, treeData, sendList } = this.props
    const qtnType = this.$router.params.qtnType
    let rightFirstIconType = ''
    let tabList = [{ title: '收集设置' }]
    if (qtnStatus !== 0) {
      tabList = [{ title: '开放链接' }, { title: '配额管理' }, { title: '证联讯收集' }]
      rightFirstIconType = canSetInv && qtnType != 80 && qtnType != 90 ? 'settings' : ''
    }
    let title = '收集数据--' + qtnName
    return (
      <View className='page'>
        <AtMessage/>
        <AtNavBar
          onClickRgIconSt={canSetInv && qtnType != 80 && qtnType != 90 ? this.handleSetting : this.handleNothing}
          color='#000'
          title={title}
          rightFirstIconType={rightFirstIconType}
        />
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            {canLink ? ((qtnStatus === 0) ? (
              <BeginToCollect beginRetrieveData={this.beginRetrieveData} />
            ) : (
                <Link linkData={linkData} />
              )) : (
                <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>无权查看数据</View>
              )}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
              <Quota QuotaList={QuotaList} />
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>尽请期待</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            {step == 0 && (
              <View>
                <View className='head'>
                  <View>证联讯收集</View>
                  <View className='btn'>
                    <AtButton type='primary' size="small" onClick={() => this.toNext(0)}>+ 创建新收集</AtButton>
                  </View>
                </View>
                <View className='table'>
                  <View className='tr thead'>
                    <View className='td-index'>序号</View>
                    <View style={{width: '130rpx'}}>计划名称</View>
                    <View>发送时间</View>
                    <View style={{width: '130rpx'}}>收件人数</View>
                    <View style={{ width: '80rpx' }}>状态</View>
                  </View>
                  {sendList.map((item, index) => (
                    <View className='tr' key={item.planId}>
                      <View className='td-index'>{index + 1}</View>
                      <View style={{ width: '130rpx' }}>{item.evtName}</View>
                      <View>{item.timing}</View>
                      <View style={{ width: '130rpx' }}>{item.sendNum}</View>
                      <View style={{width: '80rpx', color: item.status == 5 ? 'green' : item.status == 4 ? 'yellow' : 'gray'}}>{item.status == 4 ? '发送中' : item.status === 7 ? "待发送" : '已发送'}</View>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {step == 1 && (
              <View>
                <View className='head'>添加联系人（已选中 {UserContactsVo.length} 个）</View>
                <View className="tree-con">
                  {data.map((item, index) => (
                    <Tree key={item.id} oid={item.id} index={index} data={item} depth={0} change={this.change} selectedList={selectedList}></Tree>
                    
                  ))}
                </View>
                <View className='step'>
                  <AtButton type='primary' onClick={() => this.toNext(1)}>下一步</AtButton>
                </View>
              </View>
            )}
            {step == 2 && (
              <View className="step2">
                <View className='head'>编辑消息内容</View>
                <AtTextarea
                  value={this.props.content}
                  onChange={this.textareaChange}
                  maxLength={200}
                  placeholder='你的问题是...'
                />
                <View className='ps'>使用说明：</View>
                <View className='ps'>输入的消息内容不超过200个字。</View>
                <View className='btn'>
                  <View>
                    <AtButton onClick={() => this.toNext(-1)}>上一步</AtButton>
                  </View>
                  <View>
                    <AtButton type='primary' onClick={() => this.toNext(2)}>确认提交</AtButton>
                  </View>
                </View>
              </View>
            )}
          </AtTabsPane>
        </AtTabs>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>提示</AtModalHeader>
          <AtModalContent>
            <View style={{textAlign: 'center'}}>请确认是否要发送调查问卷？</View>
            {/* <AtRadio
              options={[
                { label: '立即发送', value: 'option1' },
                { label: '定时发送', value: 'option2' },
              ]}
              value={this.state.sendType}
              onClick={this.sendTypeChange}
            />
            {this.state.sendType == 'option2' && (
              <View>
                <Picker mode='date' onChange={this.onDateChange} onCancel={this.timeCancel}>
                  <AtList>
                    <AtListItem title='请选择日期' extraText={this.state.dateSel} />
                  </AtList>
                </Picker>
                <Picker mode='time' onChange={this.onTimeChange} onCancel={this.timeCancel}>
                  <AtList>
                    <AtListItem title='请选择时间' extraText={this.state.timeSel} />
                  </AtList>
                </Picker>
              </View>
            )} */}
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.cancel}>取消</Button>
            <Button type='primary' onClick={this.send}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Invitation;

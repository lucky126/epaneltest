import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text, Radio } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtMessage, AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import Questionaires from '../../components/questionaire'
import './index.scss';

@connect(({ project, common }) => ({
  ...project,
  ...common
}))

class Index extends Component {
  config = {
    navigationBarTitleText: '项目问卷列表',
  };
  constructor(props) {
    super(props)
    this.state = {
      mode: '',
      changeText: '',
      isModalChangeOpened: false,
      qtnId: '',
      type: '',
      qtnName1: '',
      modelTitle: '',
      isCreate: false,
      selectid: 0,
      prjId: 0,
      pageSize: 6,
      status: '',
      sortOrder: 'desc',
      qtnName: '',
      view: false,
    }
    this.changeId = this.changeId.bind(this)
    this.copy = this.copy.bind(this)
    this.delete = this.delete.bind(this)
    this.HandleQtnType = this.HandleQtnType.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.closeModalChangeChange = this.closeModalChangeChange.bind(this)
    this.handleConfirmChange = this.handleConfirmChange.bind(this)
  }

  componentWillMount() {
    this.setState({
      prjId: this.$router.params.id,
      view: this.$router.params.view === 'true'
    });
    //获得问卷类型
    this.props.dispatch({
      type: 'project/getQuestionaireTypes',
      payload: {},
      token: this.props.token
    })
    this.getData(this.$router.params.id)
  }
  componentDidMount = () => {
  }
  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'project/save',
      payload: {
        qtnPage: 1,
        prjQtnList: []
      },
    });
  }
  getData(prjId) {
    const {
      pageSize,
      status,
      sortOrder,
      qtnName,
      view
    } = this.state
    const { qtnPage } = this.props
    let params = {
      page: qtnPage,
      pageSize,
      prjId: Number(prjId),
      sortOrder,
      view,
      status,
      qtnName
    }
    //获得问卷
    this.props.dispatch({
      type: 'project/queryQuestionnaire',
      payload: params,
      token: this.props.token
    })
  }
  // 小程序上拉加载
  onReachBottom() {
    this.props.dispatch({
      type: 'project/save',
      payload: {
        qtnPage: this.props.qtnPage + 1,
      },
    });
    this.getData(this.state.prjId)
  }
  handleChangeStatus = (id, index, oldStatus, newStatus) => {

  }
  changeId(id) {
    this.setState({ selectid: id })
  }
  copy(item) {
    this.setState({ isCreate: true, modelTitle: '复制问卷', qtnName1: item.qtnTitle + '-副本', type: item.qtnType, qtnId: item.id })
  }
  delete(item) {
    this.setState({ isModalChangeOpened: true, changeText: '确认删除此项问卷？', qtnId: item.id, mode: 'delete' })
  }
  HandleQtnType(val) {
    this.setState({
      type: val
    })
  }
  // 关闭弹框
  handleClose() {
    this.setState({
      isCreate: false,
      qtnName1: '',
      type: ''
    })
  }
  // 确定
  handleConfirm() {
    const { qtnName1, type, qtnId, prjId } = this.state
    if (qtnName1.length === 0) {
      Taro.atMessage({
        'message': '问卷名称不能为空',
        'type': 'error',
      })
      return
    }
    if (type.length === 0) {
      Taro.atMessage({
        'message': '请选择问卷类型',
        'type': 'error',
      })
      return
    }
    Taro.showLoading({ title: '加载中...', mask: true })
    var params = {
      prjId,
      qtnId,
      qtnName: qtnName1,
      qtnType: type
    }
    this.props.dispatch({
      type: 'home/copyQuestionnaire',
      payload: params,
      token: this.props.token
    }).then(() => {
      this.setState({
        isCreate: false
      })
      this.props.dispatch({
        type: 'project/save',
        payload: {
          qtnPage: 1
        }
      })
      this.getData(prjId)
    })
  }
  closeModalChangeChange() {
    this.setState({ isModalChangeOpened: false })
  }
  handleConfirmChange() {
    const { qtnId, index, newStatus, mode, prjId } = this.state
    Taro.showLoading({ title: '正在删除...', mask: true })
    this.props.dispatch({
      type: 'home/deleteQuestionnaire',
      payload: {
        qtnId,
      },
      token: this.props.token
    }).then(() => {
      this.setState({ isModalChangeOpened: false })
      this.props.dispatch({
        type: 'project/save',
        payload: {
          qtnPage: 1
        }
      })
      this.getData(prjId)
    })
    return
  }

  render() {
    const { prjQtnList, qtnTypes, prjFlag } = this.props
    const { view, prjId, modelTitle, isCreate, qtnName1, isModalChangeOpened, changeText, type, selectid } = this.state
    const qtProps = {
      qtnTypes,
      prjFlag,
      prjId,
      view,
      selectid,
      changeId: this.changeId,
      copy: this.copy,
      delete: this.delete,
      onChangeStatus: this.handleChangeStatus
    }
    return (
      <View className='page'>
        <AtMessage />
        <View className='project'>
          {prjQtnList && prjQtnList.map((item, key) => (
            // <View>({item.id}){item.qtnTitle}</View>
            <View key={item.id}>
              <Questionaires qtns={item} index={key} {...qtProps} />
            </View>
          ))}
        </View>
        {isCreate && <AtModal isOpened={isCreate} closeOnClickOverlay={false}>
          <AtModalHeader>{modelTitle}</AtModalHeader>
          <AtModalContent>
            <View>
              <AtInput
                name='value'
                title='问卷名称'
                type='text'
                placeholder='请填写问卷名称'
                value={qtnName1}
                onChange={this.handleName}
              />
            </View>
            <View className='typelist'>
              <View className='select_type'>选择类型</View>
              {qtnTypes.map((val, key) => (
                !!val && (key != 80 && key != 90) && <View key={key}>
                  <Radio name='list' style={{ transform: 'scale(0.8)' }} value='选中' checked={key == type ? true : false} onClick={() => this.HandleQtnType(key)}></Radio>
                  <Text>{val}</Text>
                </View>
              ))}
            </View>
          </AtModalContent>
          <AtModalAction> <Button onClick={this.handleClose}>取消</Button> <Button onClick={this.handleConfirm}>确定</Button> </AtModalAction>
        </AtModal>}
        <AtModal
          isOpened={isModalChangeOpened}
          closeOnClickOverlay={false}
          title='确认提示'
          cancelText='取消'
          confirmText='确认'
          content={changeText}
          onClose={this.closeModalChangeChange}
          onCancel={this.closeModalChangeChange}
          onConfirm={this.handleConfirmChange}
        />
      </View>
    )
  }
}

export default Index;

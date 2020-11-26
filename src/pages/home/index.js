import Taro, { Component } from '@tarojs/taro';
import { View,Button,Text,Radio } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtNavBar, AtMessage, AtInput,AtModal, AtSearchBar, AtDrawer,AtModalHeader,AtModalContent,AtModalAction } from 'taro-ui'
import Questionaires from '../../components/questionaire'
import './index.scss';

@connect(({ home, common }) => ({
  ...home,
  ...common
}))


class Home extends Component {
  config = {
    navigationBarTitleText: '问卷列表',
  };

  constructor(props) {
    super(props)
    this.state = {
      isModalExitOpened: false,
      isModalChangeOpened: false,
      changeText: '',
      pageSize: 6,
      status: '',
      qtnType: '',
      sortOrder: 'desc',
      qtnName: '',
      createTimeBegin: '',
      createTimeEnd: '',
      userId: 0,
      isCurrUser: true,
      qtnId: 0,
      index: 0,
      oldStatus: 0,
      newStatus: 0,
      drawerShow: false,
      isCreate:false,
      qtnName1:'',
      type:''
    }
    this.handleCreate = this.handleCreate.bind(this)
    this.handleName = this.handleName.bind(this)
    this.HandleQtnType = this.HandleQtnType.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillMount() {
    const token = this.props.token || Taro.getStorageSync('token');

    if (!token) {
      Taro.redirectTo({
        url: '../login/index'
      })
    }

    this.getData()
  };

  componentWillUnmount() {

  }
  
  componentWillUnmount = ()=>{
    this.props.dispatch({
      type: 'home/save',
      payload: {
        page: 1,
        qtnList: []
      },
    });
  }

  componentDidShow = () => {
    this.getData()
  }

  getData() {
    const {
      pageSize,
      status,
      createTimeBegin,
      createTimeEnd,
      qtnType,
      userId,
      sortOrder,
      qtnName
    } = this.state

    const { page } = this.props

    let params = {
      page,
      pageSize,
      status,
      qtnType,
      userId,
      sortOrder,
      qtnName,
      createTimeBegin:
        createTimeBegin == ''
          ? createTimeBegin
          : createTimeBegin + ' 00:00:00',
      createTimeEnd:
        createTimeEnd == '' ? createTimeEnd : createTimeEnd + ' 23:59:59'
    }

    //获得问卷类型
    this.props.dispatch({
      type: 'home/getQuestionaireTypes',
      payload: {},
      token: this.props.token
    })

    //获得问卷列表
    this.props.dispatch({
      type: 'home/getQuestionaires',
      payload: params,
      token: this.props.token
    })

    //验证用户是否有项目权限
    this.props.dispatch({
      type: 'home/verifyUserExistProjects',
      payload: {},
      token: this.props.token
    })
  }

  handleClick = () => {

  }

  handleLogout = () => {
    this.props.dispatch({
      type: 'home/logout',
    })
  }

  handleModalExitShow = () => {
    this.setState({
      ['isModalExitOpened']: true
    })
  }

  closeModalExit = () => {
    this.setState({
      ['isModalExitOpened']: false
    })
  }

  // 小程序上拉加载
  onReachBottom() {
    this.props.dispatch({
      type: 'home/save',
      payload: {
        page: this.props.page + 1,
      },
    });
    this.getData()
  }

  onChangeSearch = (value) => {
    this.setState({
      qtnName: value
    })
  }

  onActionClick = () => {
    // console.log(this.state.qtnName)
    this.props.dispatch({
      type: 'home/save',
      payload: {
        page: 1,
        qtnList: []
      },
    });
    this.getData()
  }

  handleChangeStatus = (id, index, oldStatus, newStatus) => {

    let context = ''
    if (oldStatus == 0 && newStatus == 2) {
      context = '请确认您要将问卷状态改为“回收中”吗？如果确认，该问卷所有数据收集将被开启，答题链接支持回答。'
    }
    if (oldStatus == 0 && newStatus == 5) {
      context = '请确认您要将问卷状态改为“已结束”吗？如果确认，该问卷所有数据收集将被停止，问卷链接关闭回答。'
    }
    if (oldStatus == 2 && newStatus == 0) {
      context = '请确认您要将问卷状态改为“编辑中”吗？如果确认，该问卷所有数据收集将被停止，问卷链接关闭回答。'
    }
    if (oldStatus == 2 && newStatus === 5) {
      context = '请确认您要将问卷状态改为“已结束”吗？如果确认，该问卷所有数据收集将被停止，问卷链接关闭回答。'
    }
    if (oldStatus == 5 && newStatus == 2) {
      context = '请确认您要将问卷状态改为“回收中”吗？如果确认，该问卷所有数据收集将被开启，问卷链接支持回答。'
    }
    if (oldStatus == 5 && newStatus == 0) {
      context = '请确认您要将问卷状态改为“编辑中”吗？'
    }

    this.setState({
      changeText: context,
      isModalChangeOpened: true,
      qtnId: id,
      index: index,
      oldStatus: oldStatus,
      newStatus: newStatus
    })
  }

  closeModalChangeChange = () => {
    this.setState({
      ['isModalChangeOpened']: false
    })
  }

  handleConfirmChange = () => {
    const { qtnId, index, newStatus } = this.state

    this.props.dispatch({
      type: 'home/updateQtnStatus',
      payload: {
        qtnId,
        qtnStatus: newStatus
      },
      index,
      token: this.props.token
    });

    this.setState({
      ['isModalChangeOpened']: false
    })
    this.getData()
  }

  handleDrawerShow = () => {
    this.setState({
      drawerShow: true
    })
  }

  onCloseDrawer = () => {
    this.setState({
      drawerShow: false
    })
  }

  onDrawerItemClick = (index) => {
    if (index === 1) {
      Taro.navigateTo({
        url: '/pages/project/index'
      })
    }
  }

  handleCreate(){
    this.setState({
      isCreate:true
    })
  }

  handleName(val){
    this.setState({
      qtnName1:val
    })
  }

  HandleQtnType(val){
    this.setState({
      type:val
    })
  }

  handleConfirm(){
    const {qtnName1,type} = this.state
    if(qtnName1.length === 0){
      Taro.atMessage({
        'message': '问卷名称不能为空',
        'type': 'error',
      })
      return
    }
    if(type.length === 0){
      Taro.atMessage({
        'message': '请选择问卷类型',
        'type': 'error',
      })
      return
    }
    const params = {
      qtnName:qtnName1,
      qtnType:type 
  }
  this.props.dispatch({
      type: 'home/createQuestionnaire',
      payload: params,
      token: this.props.token
  }).then(()=>{
    this.setState({
      isCreate:false
    })
    this.getData()
  })
  }

  handleClose(){
    this.setState({
      isCreate:false
    })
  }

  render() {
    const { qtnList, qtnTypes, projectExist } = this.props
    const {isCreate,qtnName1,type} = this.state
    const qtProps = {
      qtnTypes,
      view: false,
      onChangeStatus: this.handleChangeStatus
    }
    //leftText='+新建问卷'
    return (
      <View className='page'>
        <AtMessage />
        <AtModal
          isOpened={this.state.isModalExitOpened}
          title='确认退出？'
          cancelText='取消'
          confirmText='确认'
          content='您确认要退出云调查系统？'
          onClose={this.closeModalExit}
          onCancel={this.closeModalExit}
          onConfirm={this.handleLogout}
        />
        <AtModal
          isOpened={this.state.isModalChangeOpened}
          title='确认提示'
          cancelText='取消'
          confirmText='确认'
          content={this.state.changeText}
          onClose={this.closeModalChangeChange}
          onCancel={this.closeModalChangeChange}
          onConfirm={this.handleConfirmChange}
        />
        <AtDrawer
          show={this.state.drawerShow}
          mask
          onClose={this.onCloseDrawer.bind(this)}
          onItemClick={this.onDrawerItemClick.bind(this)}
          items={['我的问卷', '我的项目']}
        ></AtDrawer>
        <AtNavBar
          onClickRgIconSt={this.handleModalExitShow}
          onClickRgIconNd={this.handleClick}
          onClickLeftIcon={projectExist ? this.handleDrawerShow : this.handleClick}
          color='#000'
          leftIconType={projectExist ? 'list' : ''}
          rightFirstIconType='user'
        >
          <View>我的问卷</View>
        </AtNavBar>
        <View className='create-question'>
          <View className='search'>
            <AtSearchBar
              value={this.state.qtnName}
              onChange={this.onChangeSearch.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
            />
          </View>  
          <View className='create' onClick={this.handleCreate}>新建问卷</View>
        </View>
        
        <View className='questionaires'>
          {qtnList && qtnList.map((item, key) => (
            // <View>({item.id}){item.qtnTitle}</View>
            <View key={item.id}>
              <Questionaires qtn={item} index={key} {...qtProps} />
            </View>

          ))}
        </View>
        <AtModal isOpened={isCreate} closeOnClickOverlay={false}>
          <AtModalHeader>问卷创建</AtModalHeader>
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
              {qtnTypes.map((val,key)=>(
                !!val && (key != 80 && key != 90) && <View>
                  <Radio name='list' style={{transform: 'scale(0.8)'}} value='选中' checked={key == type ? true :false} onClick={()=>this.HandleQtnType(key)}></Radio>
                  <Text>{val}</Text>
                </View>
              ))}
            </View>
          </AtModalContent>
          <AtModalAction> <Button onClick={this.handleClose}>取消</Button> <Button onClick={this.handleConfirm}>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Home;

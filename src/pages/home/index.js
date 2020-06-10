import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtNavBar, AtMessage, AtModal, AtSearchBar, AtDrawer } from 'taro-ui'
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
      drawerShow: false
    }
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

  render() {
    const { qtnList, qtnTypes, projectExist } = this.props

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

        <AtSearchBar
          value={this.state.qtnName}
          onChange={this.onChangeSearch.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
        />

        <View className='questionaires'>
          {qtnList && qtnList.map((item, key) => (
            // <View>({item.id}){item.qtnTitle}</View>
            <View key={item.id}>
              <Questionaires qtn={item} index={key} {...qtProps} />
            </View>

          ))}
        </View>
      </View>
    )
  }
}

export default Home;

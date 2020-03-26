import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtNavBar, AtMessage, AtModal, AtSearchBar } from 'taro-ui'
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
      isModalOpened: false,
      pageSize: 6,
      status: '',
      qtnType: '',
      sortOrder: 'desc',
      qtnName: '',
      createTimeBegin: '',
      createTimeEnd: '',
      startTime: null,
      endTime: null,
      limitBeginTime: false,
      limitExpireTime: false,
      userId: 0,
      isCurrUser: true,
      isOpen: false,
      isShow: false,
      isOpen2: false,
      oldStatus: 0,
      newStatus: 0,
      oldQtnType: '',
      newQtnType: '',
      oldQtnName: '',
      newQtnName: '',
      isTop: true,
      value: ''
    }
  }

  componentDidMount() {
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
  }

  handleClick = () => {

  }

  handleLogout = () => {
    this.props.dispatch({
      type: 'home/logout',
    })
  }

  handleModalShow = () => {
    this.setState({
      ['isModalOpened']: true
    })
  }

  closeModal = () => {
    this.setState({
      ['isModalOpened']: false
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
    console.log(this.state.qtnName)
    this.props.dispatch({
      type: 'home/save',
      payload: {
        page: 1,
        qtnList: []
      },
    });
    this.getData()
  }


  render() {
    const { qtnList, qtnTypes } = this.props

    const qtProps = {
      qtnTypes
    }
//leftText='+新建问卷'
    return (
      <View className='page'>
        <AtMessage />
        <AtModal
          isOpened={this.state.isModalOpened}
          title='确认退出？'
          cancelText='取消'
          confirmText='确认'
          content='您确认要退出云调查系统？'
          onClose={this.closeModal}
          onCancel={this.closeModal}
          onConfirm={this.handleLogout}
        />
        <AtNavBar
          onClickRgIconSt={this.handleModalShow}
          onClickRgIconNd={this.handleClick}
          onClickLeftIcon={this.handleClick}
          color='#000'
          
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
          {qtnList && qtnList.map((item) => (
            // <View>({item.id}){item.qtnTitle}</View>
            <View key={item.id}>
              <Questionaires qtn={item} {...qtProps} />
            </View>

          ))}
        </View>
      </View>
    )
  }
}

export default Home;

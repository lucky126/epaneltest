import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Questionaires from '../../components/questionaire'
import './index.scss';
import { AtNavBar, AtMessage, AtModal } from 'taro-ui'

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
      total: 0,
      page: 1,
      pageSize: 6,
      isLoading: false,
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
      qtnId: 0,
      index: 0,
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

  getData() {
    const {
      page,
      pageSize,
      status,
      createTimeBegin,
      createTimeEnd,
      qtnType,
      userId,
      sortOrder,
      qtnName
    } = this.state

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
    }).then(() => {
      console.log('get questionaireType')
    })

    //获得问卷列表
    this.props.dispatch({
      type: 'home/getQuestionaires',
      payload: params,
      token: this.props.token
    }).then(() => {
      console.log('get questionaires')
    })
  }

  handleClick = () => {

  }
  
  handleLogout = () => {
    console.log('logout')
    Taro.removeStorageSync('token')
    Taro.redirectTo({
      url: '/pages/login/index',
    })
  }

  handleModalShow = () => {
    this.setState({
      ['isModalOpened']: true
    })
  }

  closeModa = () => {
    this.setState({
      ['isModalOpened']: false
    })
  }
  
  render() {
    const { qtnList, qtnTypes } = this.props

    const qtProps = {
      qtnTypes
    }

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
          leftText='+新建问卷'
          rightFirstIconType='user'
        >
          <View>我的问卷</View>
        </AtNavBar>
        <View className='questionaires'>
          {qtnList && qtnList.map((item, index) => (
            // <View>({item.id}){item.qtnTitle}</View>
            <Questionaires qtn={item} {...qtProps} />
          ))}
        </View>
      </View>
    )
  }
}

export default Home;

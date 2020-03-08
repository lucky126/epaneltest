import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Questionaires from '../../components/questionaire'
import './index.scss';
import { AtSearchBar, AtMessage } from 'taro-ui'

@connect(({ home, common }) => ({
  ...home,
  ...common
}))


class Index extends Component {
  config = {
    navigationBarTitleText: '问卷列表',
  };

  constructor(props) {
    super(props)
    this.state = {
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

  componentDidMount = () => {
    if (!this.props.token) {
      Taro.redirectTo({
        url: '../login/index'
      })
    }

    this.getData()
  };

  componentWillUnmount = () => {
    if (this.props.token) {
      Taro.redirectTo({
        url: '../home/index'
      })
    }
  }

  getData = () => {
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

  onChange(value) {
    this.setState({
      value: value
    })
  }

  render() {
    const { qtnList,qtnTypes } = this.props

    const qtProps = {
      qtnTypes
    }

    return (
      <View className='page'>
        <AtMessage />
        <AtSearchBar
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
        <View className='questionaires'>
          {qtnList && qtnList.map((item, index) => (
            // <View>({item.id}){item.qtnTitle}</View>
            <Questionaires qtn={item} {...qtProps}/>
          ))}
        </View>
      </View>
    )
  }
}

export default Index;

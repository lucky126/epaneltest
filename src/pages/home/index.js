import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import { AtSearchBar } from 'taro-ui'

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
      pageSize: 10,
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

    let params =  {
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

    this.props.dispatch({
      type: 'home/getQuestionaires',
      payload: params
    }).then(()=>{
      console.log('get questionaires')
    })
  }

  onChange (value) {
    this.setState({
      value: value
    })
  }

  render() {
    const { list } = this.props
    console.log(list)
    return (
      <View className="page">
        <AtMessage />
        <AtSearchBar
        value={this.state.value}
        onChange={this.onChange.bind(this)}
      />
        <AtList>
          {list.map((item, index) => (
           <View>
             ({item.id}){item.qtnTitle}
           </View>
          ))}
        </AtList>
      </View>
    )
  }
}

export default Index;

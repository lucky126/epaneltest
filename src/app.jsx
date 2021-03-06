import Taro, { Component } from '@tarojs/taro'

import "./config/taroConfig"

import Login from './pages/login';
import dva from './utils/dva';
import models from './models';
import { Provider } from '@tarojs/redux';
import { globalData } from "./utils/common";

import 'taro-ui/dist/style/index.scss'
import './styles/base.scss';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

 /**
   *
   *  1.小程序打开的参数 globalData.extraData.xx
   *  2.从二维码进入的参数 globalData.extraData.xx
   *  3.获取小程序的设备信息 globalData.systemInfo
   * @memberof App
   */
  async componentDidMount() {
    // 获取参数
    const referrerInfo = this.$router.params.referrerInfo;
    const query = this.$router.params.query;
    !globalData.extraData && (globalData.extraData = {});
    if (referrerInfo && referrerInfo.extraData) {
      globalData.extraData = referrerInfo.extraData;
    }
    if (query) {
      globalData.extraData = {
        ...globalData.extraData,
        ...query
      };
    }

    // 获取设备信息
    const sys = await Taro.getSystemInfo();
    sys && (globalData.systemInfo = sys);
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'pages/home/index',
      'pages/home/show',
      'pages/login/index',
      'pages/login/formlogin',
      'pages/login/wxlogin',
      'pages/data/index',
      'pages/data/anwserdetail',
      'pages/invitation/index',
      'pages/invitation/collect',
      'pages/invitation/answer',
      'pages/project/index',
      'pages/project/manage',
      'pages/edit/index',
      'pages/edit/editOpt'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#6190e8',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white',
    },
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Login />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

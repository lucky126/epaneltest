import Taro from '@tarojs/taro';
import { noConsole } from '../../config';
import * as loginApi from './service';

export default {
  namespace: 'login',
  state: {
    token: '',
    userInfo: ''
  },

  effects: {
    * formLogin({ payload: values }, { call, put }) {

      let afterError = function ({ response }) {

      }

      const { data } = yield call(loginApi.login, values, afterError);

      if (!noConsole) {
        console.log(
          `${new Date().toLocaleString()} 【response】`,
          data
        );
        console.log(
          `${new Date().toLocaleString()} [token]`,
          data.message.data.token
        );
      }
      
      Taro.setStorage({
        key: "token",
        data: data.message.data.token
      })
      Taro.setStorage({
        key: "userinfo",
        data: data.message.data.user
      })

      Taro.atMessage({
        'message': '登录成功',
        'type': 'success',
        'duration': 1000
      })

      yield put({
        type: 'save',
        payload: {
          token: data.message.data.token,
          userinfo: data.message.data.user
        }
      });

      yield put({
        type: 'common/save',
        payload: {
          token: data.message.data.token,
          userinfo: data.message.data.user
        }
      });

      setTimeout(() => {
        Taro.redirectTo({
          url: '../home/index'
        })
      }, 500);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

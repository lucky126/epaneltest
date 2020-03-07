import Taro from '@tarojs/taro';
import { noConsole, HTTP_STATUS } from '../../config';
import * as loginApi from './service';

export default {
  namespace: 'login',
  state: {
    token: '',
    userInfo: ''
  },

  effects: {
    * wxCode2Session({ payload: values }, { call, put }) {

      const { data } = yield call(loginApi.wxCode2Session, values);
      console.log(data)

    },
    * formLogin({ payload: values }, { call, put }) {

      const { data } = yield call(loginApi.login, values);

      if (data.status == HTTP_STATUS.SUCCESS) {
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
      } else {
        Taro.atMessage({
          'message': data.message.text || '登录失败',
          'type': 'error',
          'duration': 1000
        })
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

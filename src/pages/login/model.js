import Taro from '@tarojs/taro';
import { noConsole, HTTP_STATUS } from '../../config';
import * as loginApi from './service';

export default {
  namespace: 'login',
  state: {
    token: '',
    userinfo: ''
  },

  effects: {
    * wxLogin({ payload: values }, { call, put }) {

      const { data } = yield call(loginApi.wxLogin, values);
      console.log(data.message.data.wxlogin)

      if (!!data.message.data.wxlogin) {
        let token = data.message.data.wxlogin.token
        let now = new Date().valueOf()

        Taro.setStorage({
          key: "token",
          data: token
        })

        Taro.setStorage({
          key: "logintime",
          data: now
        })

        Taro.atMessage({
          'message': '登录成功',
          'type': 'success',
          'duration': 1000
        })

        yield put({
          type: 'save',
          payload: {
            token: token
          }
        });

        yield put({
          type: 'common/save',
          payload: {
            token: token,
            logintime: now
          }
        });

        setTimeout(() => {
          Taro.redirectTo({
            url: '../home/index'
          })
        }, 500);
      }

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

        let token = data.message.data.token
        let now = new Date().valueOf()
        Taro.setStorage({
          key: "token",
          data: token
        })
        Taro.setStorage({
          key: "userinfo",
          data: data.message.data.user
        })
        Taro.setStorage({
          key: "logintime",
          data: now
        })

        Taro.atMessage({
          'message': '登录成功',
          'type': 'success',
          'duration': 1000
        })

        yield put({
          type: 'save',
          payload: {
            token: token,
            userinfo: data.message.data.user
          }
        });

        yield put({
          type: 'common/save',
          payload: {
            token: token,
            userinfo: data.message.data.user,
            logintime: now
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

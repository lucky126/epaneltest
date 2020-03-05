import Taro from '@tarojs/taro';
import * as loginApi from './service';

export default {
  namespace: 'login',
  state: {

  },

  effects: {
    * formLogin({ payload: values }, { call, put }) {
      let afterSuccess = function ({ response }) {
        console.log(
          `${new Date().toLocaleString()} 【response】`,
          response
        );
        console.log(
          `${new Date().toLocaleString()} [token]`,
          response.data.token
        );
        Taro.setStorage({
          key: "token",
          data: response.data.token
        })
        Taro.atMessage({
          'message': '登录成功',
          'type': 'success',
          'duration': 1000
        })
        Taro.redirectTo({
          url: '../home/index'
        })
      }
      let afterError = function ({ response }) {

      }

      const { status, data } = yield call(loginApi.login, values, afterSuccess, afterError);
      if (status === 'ok') {
        yield put({
          type: 'save',
          payload: {
            topData: data,
          }
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

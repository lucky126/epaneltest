import Taro from '@tarojs/taro';
import * as homeApi from './service';

export default {
  namespace: 'home',
  state: {
    qtnList: '',
    qtnTypes: ''
  },

  effects: {
    * getQuestionaireTypes({ token }, { call, put }) {
      const { data } = yield call(homeApi.getQuestionaireType, {}, token);

      let qtnTypes = data.message.data.list
      var dic = new Array();
      qtnTypes.forEach(item => {
        dic[item.type] = item.typeName
      })

      yield put({
        type: 'save',
        payload: {
          qtnTypes: dic,
        }
      });
    },
    * getQuestionaires({ payload: values, token }, { call, put }) {
      const { data } = yield call(homeApi.getQuestionaires, values, token);

      yield put({
        type: 'save',
        payload: {
          qtnList: data.message.data.list,
        }
      });

    },
    * logout(_, { put }) {

      yield put({
        type: 'common/save',
        payload: {
          token: '',
          userinfo: '',
          logintime: ''
        }
      });

      Taro.removeStorageSync('token')
      Taro.redirectTo({
        url: '/pages/login/index',
      })

    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

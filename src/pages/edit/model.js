import Taro from '@tarojs/taro';
import * as editApi from './service';

export default {
  namespace: 'edit',
  state: {
    qtn:{},
    optsList:{},
    isChange:true
  },

  effects: {
    * getQuestionnaire({payload: values, token  }, { call, put }) {
      const { data } = yield call(editApi.getQuestionnaire, values, token);
      yield put({
        type: 'save',
        payload: {
            qtn: data.message.data.qtn,
        }
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

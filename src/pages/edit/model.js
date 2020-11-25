import Taro from '@tarojs/taro';
import * as editApi from './service';

export default {
  namespace: 'edit',
  state: {
    qtn:{},
    optsList:{},
    isChange:true,
    logicVersion:''
  },

  effects: {
    * getQuestionnaire({payload: values, token  }, { call, put }) {
      const { data } = yield call(editApi.getQuestionnaire, values, token);
      yield put({
        type: 'save',
        payload: {
            qtn: data.message.data.qtn
        }
      });
    },
    * getQuestionnaireVersion({payload: values, token  }, { call, put }) {
      const { data } = yield call(editApi.getQuestionnaireVersion, values, token);
      yield put({
        type: 'save',
        payload: {
          logicVersion: data.message.data.logicVersion.version
        }
      });
    },
    * saveQuestionnaire({payload: values, token  }, { call, put }) {
      const { data } = yield call(editApi.saveQuestionnaire, values, token);
      console.log(data)
      yield put({
        type: 'save',
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

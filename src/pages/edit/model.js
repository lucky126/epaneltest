import Taro from '@tarojs/taro';
import * as editApi from './service';

export default {
  namespace: 'edit',
  state: {
    qtn:{},
    optsList:{},//记录要修改的题目
    isChange:true,
    logicVersion:'',
    questionnaire:{},
    qt:{},
    pageIndex:'',//记录修改题目所在页
    index:'',//记录题目位置
    extQuery:''
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
    * saveQuestion({payload: values, token  }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          optsList:values.optsList,
          pageIndex:values.pageIndex,
          index:values.index
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
      yield put({
        type: 'save',
      });
    },
    * addQuestion({payload: values, token  }, { call, put }) {
      const { data } = yield call(editApi.addQuestion, values, token);
      yield put({
        type: 'save',
        payload: {
          qt: data.message.data.qt
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

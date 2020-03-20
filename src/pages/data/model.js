import * as dataApi from './service';

export default {
  namespace: 'data',
  state: {
    RetrievalProgressData: '',
    resultData: [],
    resultPage: 1
  },

  effects: {
    
    * getRetrievalProgress({ payload: values, token }, { call, put }) {
      const { data } = yield call(dataApi.getRetrievalProgress, values, token);

      yield put({
        type: 'save',
        payload: {
          RetrievalProgressData: data.message.data
        }
      });

    },

    * getAnswerStatus({ payload: values, token }, { call, put, select }) {
      const { resultPage, resultData } = yield select(state => state.data);
      const { data } = yield call(dataApi.getAnswerStatus, values, token);

      yield put({
        type: 'save',
        payload: {
          resultData:
          resultPage > 1 ? [...resultData, ...data.message.data.list] : data.message.data.list,
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

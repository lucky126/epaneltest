import * as dataApi from './service';

export default {
  namespace: 'data',
  state: {
    RetrievalProgressData: ''
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
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

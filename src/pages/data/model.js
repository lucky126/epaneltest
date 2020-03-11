import * as dataApi from './service';

export default {
  namespace: 'data',
  state: {
    RetrievalProgress: ''
  },

  effects: {
    
    * getRetrievalProgress({ payload: values, token }, { call, put }) {
      const { data } = yield call(dataApi.getRetrievalProgress, values, token);

      yield put({
        type: 'save',
        payload: {
          RetrievalProgress: data.message.data
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

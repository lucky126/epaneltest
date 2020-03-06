import * as homeApi from './service';

export default {
  namespace: 'home',
  state: {
    list: ''
  },

  effects: {
    * getQuestionaires({ payload: values, token }, { call, put }) {
  
      const { data } = yield call(homeApi.getQuestionaires, values, token);

      yield put({
        type: 'save',
        payload: {
          list: data.message.data.list,
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

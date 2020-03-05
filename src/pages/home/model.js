import * as homeApi from './service';

export default {
  namespace: 'home',
  state: {
    list: ''
  },

  effects: {
    * getQuestionaires({ payload: values, token }, { call, put }) {
      let afterError = function ({ response }) {

      }

      const { data } = yield call(homeApi.getQuestionaires, values, afterError, token);

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

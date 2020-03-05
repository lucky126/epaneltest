import * as homeApi from './service';

export default {
  namespace: 'home',
  state: {
    list: ''
  },

  effects: {
    * getQuestionaires({ payload: values }, { call, put }) {
      let afterError = function ({ response }) {

      }

      const { data } = yield call(homeApi.getQuestionaires, values, afterError);

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

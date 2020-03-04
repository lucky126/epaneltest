import * as loginApi from './service';

export default {
  namespace: 'login',
  state: {

  },

  effects: {
    * effectsLogin({ payload: values }, { call, put }) {
      const { status, data } = yield call(loginApi.login, values);
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

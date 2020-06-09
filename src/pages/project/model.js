import * as projectApi from './service';

export default {
  namespace: 'project',
  state: {
    demo: ''
  },

  effects: {
    * demo({ payload: values, token }, { call, put }) {
      const { data } = yield call(projectApi.demo, values, token);

      yield put({
        type: 'save',
        payload: {
          demo: data.message.data.demo
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

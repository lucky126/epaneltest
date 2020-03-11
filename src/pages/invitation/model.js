import * as invitationApi from './service';

export default {
  namespace: 'invitation',
  state: {
    qtnStatus: '',
    limitConstraints: ''
  },

  effects: {
    * statusCheck({ payload: values, token }, { call, put }) {
      const { data } = yield call(invitationApi.statusCheck, values, token);

      yield put({
        type: 'save',
        payload: {
          qtnStatus: data.message.data.qtnStatus
        }
      });

    },
    * getLimitConstraints({ payload: values, token }, { call, put }) {
      const { data } = yield call(invitationApi.getLimitConstraints, values, token);

      yield put({
        type: 'save',
        payload: {
          limitConstraints: data.message.data
        }
      });

    },
    * beginRetrieve({ payload: values, token }, { call, put }) {
      const { data } = yield call(invitationApi.beginRetrieve, values, token);

      yield put({
        type: 'save',
        payload: {
          qtnStatus: data.message.data.qtnStatus
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

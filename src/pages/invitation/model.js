import * as invitationApi from './service';

export default {
  namespace: 'invitation',
  state: {
    qtnStatus: '',
    limitConstraints: '',
    linkData: ''
  },

  effects: {
    * statusCheck({ payload: values, token }, { call, put }) {
      console.log('values')
      console.log(values)
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
    * getWebLink({ payload: values, token }, { call, put }) {
      const { data } = yield call(invitationApi.getWebLink, values, token);
      
      yield put({
        type: 'save',
        payload: {
          linkData: data.message.data
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

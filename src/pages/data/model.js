import * as dataApi from './service';

export default {
  namespace: 'data',
  state: {
    qtnList: '',
    qtnTypes: ''
  },

  effects: {
    * getQuestionaireTypes({ token }, { call, put }) {
      const { data } = yield call(dataApi.getQuestionaireType, {}, token);

      let qtnTypes = data.message.data.list
      var dic = new Array();
      qtnTypes.forEach(item => {
        dic[item.type] = item.typeName
      })

      yield put({
        type: 'save',
        payload: {
          qtnTypes: dic,
        }
      });
    },
    * getQuestionaires({ payload: values, token }, { call, put }) {
      const { data } = yield call(dataApi.getQuestionaires, values, token);

      yield put({
        type: 'save',
        payload: {
          qtnList: data.message.data.list,
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

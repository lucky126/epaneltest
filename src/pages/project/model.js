import * as projectApi from './service';

export default {
  namespace: 'project',
  state: {
    prjList: [],
    page: 1,
    qtnTypes: '',
  },

  effects: {
    * queryProjects({ payload: values, token }, { call, put, select }) {
      const { page, prjList } = yield select(state => state.project);
      const { data } = yield call(projectApi.queryProject, values, token);

      yield put({
        type: 'save',
        payload: {
          prjList:
            page > 1 ? [...prjList, ...data.message.data.list] : data.message.data.list,
        }
      });

    },
    * getQuestionaireTypes({ token }, { call, put }) {
      const { data } = yield call(projectApi.getQuestionaireType, {}, token);

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
  },
  

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

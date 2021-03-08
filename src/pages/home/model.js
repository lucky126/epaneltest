import Taro from '@tarojs/taro';
import * as homeApi from './service';

export default {
  namespace: 'home',
  state: {
    qtnListTotal: 0,
    qtnList: [],
    page: 1,
    qtnTypes: '',
    qtnName: '',
    projectExist: false,
    questionTypes: []
  },

  effects: {
    * getQuestionnaireName({ payload: values, token }, { call, put }) {
      const { data } = yield call(homeApi.getQuestionnaireName, values, token);

      yield put({
        type: 'save',
        payload: {
          qtnName:data.message.data.qtnName,
        }
      });

    },
    * getQuestionaireTypes({ token }, { call, put }) {
      const { data } = yield call(homeApi.getQuestionaireType, {}, token);

      let qtnTypes = data.message.data.list
      var dic = new Array();
      qtnTypes.forEach(item => {
        dic[item.type] = item.typeName
      })

      yield put({
        type: 'save',
        payload: {
          qtnTypes: dic,
          questionTypes: qtnTypes
        }
      });
    },
    * getQuestionaires({ payload: values, token }, { call, put, select }) {
      const { page, qtnList } = yield select(state => state.home);
      const { data } = yield call(homeApi.getQuestionaires, values, token);

      yield put({
        type: 'save',
        payload: {
          qtnList:
            page > 1 ? [...qtnList, ...data.message.data.list] : data.message.data.list,
          qtnListTotal: data.message.data.total
        }
      });

    },
    * createQuestionnaire({ payload: values, token }, { call, put, select }) {
      const { data } = yield call(homeApi.createQuestionnaire, values, token);
      yield put({
        type: 'save'
      });
    },
    * copyQuestionnaire({ payload: values, token }, { call, put, select }) {
      const { data } = yield call(homeApi.copyQuestionnaire, values, token);
      yield put({
        type: 'save'
      });
      Taro.hideLoading()
      if(data.status == 200) {
        Taro.atMessage({message: '复制成功', type: 'success'})
      } else {
        Taro.atMessage({message: '操作失败，请检查网络或联系管理员', type: 'error'})
      }
    },
    * deleteQuestionnaire({ payload: values, token }, { call, put, select }) {
      const { data } = yield call(homeApi.deleteQuestionnaire, values, token);
      yield put({
        type: 'save'
      });
      Taro.hideLoading()
      if(data.status == 200) {
        Taro.atMessage({message: '删除成功', type: 'success'})
      } else {
        Taro.atMessage({message: '操作失败，请检查网络或联系管理员', type: 'error'})
      }
    },
    * verifyUserExistProjects({ token }, { call, put }) {
      const { data } = yield call(homeApi.verifyUserExistProjects, {}, token);
      yield put({
        type: 'save',
        payload: {
          projectExist: data.message.data.exist,
        }
      });
    },
    * updateQtnStatus({ payload: values, index, token }, { call, put, select }) {
      const { qtnList } = yield select(state => state.home);
      yield call(homeApi.updateQtnStatus, values, token);

      qtnList[index].status = values.qtnStatus
      
      yield put({
        type: 'save',
        payload: {
          qtnList: qtnList ,
        }
      });
    },
    * logout(_, { put }) {

      yield put({
        type: 'common/save',
        payload: {
          token: '',
          userinfo: '',
          logintime: ''
        }
      });

      Taro.removeStorageSync('token')
      Taro.redirectTo({
        url: '/pages/login/index',
      })

    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

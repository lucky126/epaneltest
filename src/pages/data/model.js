import * as dataApi from './service';
import { HTTP_STATUS } from '../../config';

export default {
  namespace: 'data',
  state: {
    RetrievalProgressData: '',
    resultData: [],
    resultPage: 1,
    answerInfo: [],
    panelInfo: {}
  },

  effects: {

    * getRetrievalProgress({ payload: values, token }, { call, put }) {
      const { data } = yield call(dataApi.getRetrievalProgress, values, token);

      yield put({
        type: 'save',
        payload: {
          RetrievalProgressData: data.message.data
        }
      });

    },

    * getAnswerStatus({ payload: values, token }, { call, put, select }) {
      const { resultPage, resultData } = yield select(state => state.data);
      const { data } = yield call(dataApi.getAnswerStatus, values, token);

      yield put({
        type: 'save',
        payload: {
          resultData:
            resultPage > 1 ? [...resultData, ...data.message.data.list] : data.message.data.list,
        }
      });

    },

    * getAnswerResultById({ payload: values, token }, { call, put }) {
      const { data } = yield call(dataApi.getAnswerResultById, values, token);

      yield put({
        type: 'save',
        payload: {
          answerInfo:
            data.message.data.answerInfo,
          panelInfo:
            data.message.data.panelInfo,
        }
      });

    },

    * deleteAnswerResultById({ payload: values, deleteId, token }, { call, put, select }) {
      const { resultData } = yield select(state => state.data);
      const { data } = yield call(dataApi.deleteAnswerResultById, values, token);

      if (data.status == HTTP_STATUS.SUCCESS) {
        resultData.splice(deleteId, 1)
        yield put({
          type: 'save',
          payload: {
            resultData: resultData
          }
        });
      }

    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

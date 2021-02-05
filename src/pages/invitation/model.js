import Taro from '@tarojs/taro';
import * as invitationApi from './service';

export default {
  namespace: 'invitation',
  state: {
    content: '', // 发送内容
    sendList: [],
    treeData: [],
    qtnStatus: '',
    limitConstraints: '',
    limitPanelNum: '',
    panelTotalNum: '',
    limitBeginTime: '',
    beginTime: '',
    limitExpireTime: '',
    expireTime: '',
    ipLimit: '',
    ipLimitNum: '',
    deviceUniqueness: '',
    isAnswerLimit: '',
    showTime: '',
    limitNum: '',
    moreConf: '',
    codeurl: ''
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

      const limitConstraints = data.message.data
      const answerLinitInfo = !!limitConstraints.moreConf && JSON.parse(limitConstraints.moreConf);

      let isAnswerLimit = ''
      let showTime = 'd'
      let limitNum = ''

      if (!(answerLinitInfo == "{}")) {
        isAnswerLimit = answerLinitInfo.isSetPeriodLimit,
          showTime = answerLinitInfo.period,
          limitNum = answerLinitInfo.limit
      }

      yield put({
        type: 'save',
        payload: {
          ipLimit: limitConstraints.ipLimit,
          ipLimitNum: limitConstraints.ipLimitNum,
          deviceUniqueness: limitConstraints.deviceUniqueness,
          isAnswerLimit: isAnswerLimit,
          showTime: showTime,
          limitNum: limitNum
        }
      });

    },
    * getPanelDemand({ payload: values, token }, { call, put }) {
      const { data } = yield call(invitationApi.getPanelDemand, values, token);

      const panelDemand = data.message.data
      yield put({
        type: 'save',
        payload: {
          limitPanelNum: panelDemand.limitPanelNum,
          panelTotalNum: panelDemand.panelTotalNum,
          limitBeginTime: panelDemand.limitBeginTime,
          beginTime: panelDemand.beginTime,
          limitExpireTime: panelDemand.limitExpireTime,
          expireTime: panelDemand.expireTime,
          moreConf: panelDemand.moreConf
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
   
    * updatePanelDemand({ payload: values, token }, { call }) {
      yield call(invitationApi.updatePanelDemand, values, token);
    },
    * updateLimitConstraints({ payload: values, token }, { call }) {
      yield call(invitationApi.updateLimitConstraints, values, token);
    },
   * getQtnQuota({ payload: values, token }, { call, put }) {
    const { data } = yield call(invitationApi.getQtnQuota, values, token);
    let Quota = []
    for(var i in data.quotaMaps){
      Quota.push( data.quotaMaps[i])
     }
    yield put({
      type: 'save',
      payload: {
        QuotaList: Quota
      }
    });
  },
    * TreePrivatization({ payload: values, plugInit }, { call, put }) {
      const { data } = yield call(invitationApi.TreePrivatization, values, plugInit);
      yield put({
        type: 'save',
        payload: {
          treeData: data.message.data.department
        }
      });
    },
    * getSendList({ payload: values }, { call, put }) {
      const { data } = yield call(invitationApi.getSendList, values);
      yield put({
        type: 'save',
        payload: {
          sendList: data.message.data.list
        }
      });
    },
    * getContent({ payload: values }, { call, put }) {
      const { data } = yield call(invitationApi.getContent, values);
      yield put({
        type: 'save',
        payload: {
          content: data.message.data.content
        }
      });
    },
    * send({ payload: values }, { call, put }) {
      const { data } = yield call(invitationApi.send, values);
      yield put({
        type: 'save'
      });
      if(data.status == 200) {
        Taro.atMessage({ message: '发送成功', type: 'success' })
      } else {
        Taro.atMessage({ message: '发送失败', type: 'error' })
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

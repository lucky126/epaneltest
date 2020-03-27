import {syncAction} from '../../utils/request';

const QUESTIONNAIRE = 'questionnaire'
const INVITION = 'invition'

//查询问卷列表
export const getQuestionaires = (data, token) => syncAction({
  method: 'QuestionnaireCreater.queryQuestionnaire',
  type: QUESTIONNAIRE,
  data,
  token
});

//查询问卷类型
export const getQuestionaireType = (data, token) => syncAction({
  method: 'QuestionnaireService.queryQuestionnaireType',
  type: QUESTIONNAIRE,
  data,
  token
});

//更新问卷状态
export const updateQtnStatus = (data, token) => syncAction({
  method: 'InvitationManager.updateQtnStatus',
  type: INVITION,
  data,
  token
});


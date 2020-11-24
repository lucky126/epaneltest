import {syncAction} from '../../utils/request';

const QUESTIONNAIRE = 'questionnaire'
const INVITION = 'invition'
const PROJECT = 'project'

//查询问卷列表
export const getQuestionaires = (data, token) => syncAction({
  method: 'QuestionnaireCreater.queryQuestionnaire',
  type: QUESTIONNAIRE,
  data,
  token
});

//获取问卷信息
export const getQuestionnaire = (data, token) => syncAction({
  method: 'QuestionnaireService.getQuestionnaire',
  type: QUESTIONNAIRE,
  data,
  token
});
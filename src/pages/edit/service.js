import {syncAction} from '../../utils/request';

const QUESTIONNAIRE = 'questionnaire'
const INVITION = 'invition'
const PROJECT = 'project'

//版本信息
export const getQuestionnaireVersion = (data, token) => syncAction({
  method: 'QuestionnaireService.getQuestionnaireVersion',
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

//保存问卷
export const saveQuestionnaire = (data, token) => syncAction({
  method: 'QuestionnaireEditor.saveQuestionnaire',
  type: QUESTIONNAIRE,
  data,
  token
});
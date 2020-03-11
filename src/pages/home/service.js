import {syncAction} from '../../utils/request';

const QUESTIONNAIRE = 'questionnaire'

export const getQuestionaires = (data, token) => syncAction({
  method: 'QuestionnaireCreater.queryQuestionnaire',
  type: QUESTIONNAIRE,
  data,
  token
});

export const getQuestionaireType = (data, token) => syncAction({
  method: 'QuestionnaireService.queryQuestionnaireType',
  type: QUESTIONNAIRE,
  data,
  token
});

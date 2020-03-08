import * as Request from '../../utils/request';

export const getQuestionaires = (data, token) => Request.syncAction({
  method: 'QuestionnaireCreater.queryQuestionnaire',
  type: 'questionnaire',
  data,
  token
});

export const getQuestionaireType = (data, token) => Request.syncAction({
  method: 'QuestionnaireService.queryQuestionnaireType',
  type: 'questionnaire',
  data,
  token
});

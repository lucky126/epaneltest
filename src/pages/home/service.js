import * as Request from '../../utils/request';

export const getQuestionaires = (data, afterError, token) => Request.syncAction({
  method: 'QuestionnaireCreater.queryQuestionnaire',
  type: 'questionnaire',
  data,
  token,
  afterError
});

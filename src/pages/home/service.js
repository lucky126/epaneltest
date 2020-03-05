import * as Request from '../../utils/request';

export const getQuestionaires = (data, afterError) => Request.syncAction({
  method: 'QuestionnaireCreater.queryQuestionnaire',
  type: 'questionnaire',
  data,
  afterError
});

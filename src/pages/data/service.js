import * as Request from '../../utils/request';

export const getRetrievalProgress = (data, token) => Request.syncAction({
  method: 'RetrievalProgress.getRetrievalProgress',
  type: 'dataanalyse',
  data,
  token
});


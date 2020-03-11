import {syncAction} from '../../utils/request';

const DATAANALYSE = 'dataanalyse'

export const getRetrievalProgress = (data, token) => syncAction({
  method: 'RetrievalProgress.getRetrievalProgress',
  type: DATAANALYSE,
  data,
  token
});


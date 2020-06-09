import {syncAction} from '../../utils/request';

const TYPE = 'type'

export const demo = (data, token) => syncAction({
  method: '',
  type: TYPE,
  data,
  token
});

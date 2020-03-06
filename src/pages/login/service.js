import * as Request from '../../utils/request';

export const login = (data) => Request.syncAction({
  method: 'UserLogin.login',
  type: 'user',
  data
});
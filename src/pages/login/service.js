import * as Request from '../../utils/request';

export const login = (data, afterSuccess, afterError) => Request.syncAction({
  method: 'UserLogin.login',
  type: 'user',
  data,
  afterSuccess,
  afterError
});
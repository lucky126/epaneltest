import * as Request from '../../utils/request';

export const login = (data, afterError) => Request.syncAction({
  method: 'UserLogin.login',
  type: 'user',
  data,
  afterError
});

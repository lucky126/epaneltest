import Request from '../../utils/request';

export const login = data => Request({
  method: 'UserLogin.login',
  type : 'user',
  data,
});
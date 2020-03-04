import Request from '../../utils/request';

export const login = data => Request({
  url: '/v2/service/api',
  method: 'UserLogin.login',
  type : 'user',
  data,
});
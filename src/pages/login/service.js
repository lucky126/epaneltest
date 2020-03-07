import * as Request from '../../utils/request';
import { WXGETSESSION, APPID, SECRET } from '../../config'

export const login = (data) => Request.syncAction({
  method: 'UserLogin.login',
  type: 'user',
  data
});

export const wxCode2Session = (data) => Request.defaultAction({
  url: WXGETSESSION + `?appid=${APPID}&secret=${SECRET}&js_code=${data}&grant_type=authorization_code`,
});
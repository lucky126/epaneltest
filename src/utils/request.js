import Taro from '@tarojs/taro';
import { MAINHOST, noConsole, HTTP_STATUS } from '../config';
import { commonParame } from '../config/requestConfig'

const url = '/v2/service/apis'

let token = Taro.getStorageSync('token')

export function syncAction(options) {
  token = options.token || token

  if (!noConsole) {
    console.log(`${new Date().toLocaleString()} token=${JSON.stringify(
      token
    )}`)
    console.log(
      `${new Date().toLocaleString()}【 type=${options.type} 】【 method=${options.method} 】data=${JSON.stringify(
        options.data
      )}`
    );
  }
  return Taro.request({
    url: MAINHOST + url,
    data: {
      "method": options.method,
      "params": options.data,
      "type": options.type,
      ...commonParame
    },
    header: {
      'Content-Type': 'application/json',
      'Authorization': 'ePanel ' + token
    },
    method: 'POST',
    success: function (res) {
      const { data } = res;
      
      if (data.status === HTTP_STATUS.SUCCESS) {
        if (!noConsole) {
          console.log(
            `${new Date().toLocaleString()}【 type=${options.type} 】【 method=${options.method} 【接口响应：】`,
            data
          );
        }

        if (data.token) {
          Taro.setStorage({
            key: "token",
            data: data.token
          })
        }
      } else if (data.status === HTTP_STATUS.AUTHENTICATE) {
        Taro.removeStorageSync('token')
        Taro.redirectTo({
          url: './login/login',
        })
      } 
    },
    fail: function (res) {
      
    }
  });
}

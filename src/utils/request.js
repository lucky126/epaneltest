import Taro from '@tarojs/taro';
import { MAINHOST, noConsole, HTTP_STATUS } from '../config';
import { commonParame } from '../config/requestConfig'

const url = '/v2/service/apis'

let token = Taro.getStorageSync('token')

export function syncAction(options) {
  if (!noConsole) {
    console.log(options)
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
      'token': token
    },
    method: 'POST',
    success: function (res) {
      const { statusCode, data } = res;
      if (statusCode === HTTP_STATUS.NOT_FOUND) {
        return logError('api', '请求资源不存在')
      } else if (statusCode === HTTP_STATUS.BAD_GATEWAY) {
        return logError('api', '服务端出现了问题')
      } else if (statusCode === HTTP_STATUS.FORBIDDEN) {
        return logError('api', '没有权限访问')
      } else if (statusCode === HTTP_STATUS.SUCCESS) {
        if (!noConsole) {
          console.log(
            `${new Date().toLocaleString()}【 type=${options.type} 】【 method=${options.method} 【接口响应：】`,
            data
          );
        }
        if (data.status == 200) {
          if (data.token) {
            Taro.setStorage({
              key: "token",
              data: data.token
            })
          }

          options.afterSuccess({
            response: data.message
          });
        } else {
          if (data.status == 401) {
            Taro.redirectTo({
              url: './',
            })          
          }
          options.afterError({
            response: data
          });
        }
      }
    },
    fail: function (res) {
      options.afterError({
        response: res.body
      });
    }
  });
}

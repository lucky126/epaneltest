import Taro from '@tarojs/taro';
import { MAINHOST, noConsole } from '../config';

const timestamp = '2017-06-30 07:49:40'
const transSeq = 'IG2gmPscw0DoKlPQ'
const version = 'V2.0'

export default (options = { method: 'GET', data: {} }) => {
  if (!noConsole) {
    console.log(
      `${new Date().toLocaleString()}【 url=${options.url} 】【 type=${options.type} 】【 method=${options.method} 】data=${JSON.stringify(
        options.data
      )}`
    );
  }
  return Taro.request({
    url: MAINHOST + options.url,
    data: {
      "method": options.method,
      "params": options.data,
      "timestamp": timestamp,
      "transSeq": transSeq,
      "type": options.type,
      "version": version
    },
    header: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(res => {
    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        console.log(
          `${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`,
          res.data
        );
      }
      if (data.status !== 'ok') {
        Taro.showToast({
          title: `${res.data.error.message}~` || res.data.error.code,
          icon: 'none',
          mask: true,
        });
      }
      return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  });
};

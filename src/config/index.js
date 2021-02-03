/** 
 * 项目配置文件
 */

/** 
 * 线上环境
 */
export const ONLINEHOST = 'https://www.epanel.cn'

/** 
 * 测试环境
 */
export const QAHOST = 'https://f.epanel.cn'
/**
 * 中证
 */
export const TAHOST = 'http://etc.epanel.cn'

/** 
 * 线上mock
 */
export const MOCKHOST = 'http://xxx/mock'

/** 
 * 是否mock
 */
export const ISMOCK = false

/**
 * 当前的host  ONLINEHOST | QAHOST | MOCKHOST
 */
export const MAINHOST = ONLINEHOST

/**
 * wx 根据 code 获取session地址
 */
export const WXGETSESSION = 'https://api.weixin.qq.com/sns/jscode2session'
export const APPID = 'wx7c2fb36925f527c0'
export const SECRET = '0218f83ffe2a60bbd3b4788eba1beab9'

// 输出日志信息
export const noConsole = true;

export const HTTP_STATUS = {
  SUCCESS: 200,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

// promise status
export const SUCCESS = { success: 'success' }
export const FAIL = { fail: 'fail' }
export const COMPLETE = { complete: 'complete' }

export const PROMISE_STATUS = {
  success: 'success',
  fail: 'fail',
  complete: 'complete'
}

export const RESULT_STATUS = {
  SUCCESS: 0,
  SIGNATURE_FAILED: 1000  // 签名失败
}

// 问卷基本状态
export const statusOpts = [
  { value: 0, label: '编辑中' },
  { value: 2, label: '回收中' },
  { value: 5, label: '已结束' }
]
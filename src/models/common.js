import Taro from '@tarojs/taro';

export default {
  namespace: 'common',
  state: {
    token: Taro.getStorageSync('token'),
    userInfo: Taro.getStorageSync('userInfo')
  },

  effects: {},

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

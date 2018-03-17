//app.js
import Fetch from '/utils/Fetch.js';
App({
  onLaunch: function () {
    // Fetch 初始化
    Fetch.init();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },
  globalData: {
    loginInfo: null,
    userInfo: null,
    categoryMap: {
      0: '情感',
      1: '事业',
      2: '心理',
      3: '健康',
    },
    // chargeTypeMap: {
    //   0: '开始测试',
    //   1: '分享免费',
    //   2: '付费测试',
    // }
  }
})
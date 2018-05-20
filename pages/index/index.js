//index.js
import Fetch from '../../utils/Fetch.js';
const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    firstAuth: true,
    failText: '',
    buttonText: '',
    pageId: 0, // 0-首页 1-测试详情页 2-测试结果页
    testId: '',
    testResultUserId: '',
    share: {
      userId: '',
      title: '',
    }
  },
  //页面加载后数据准备
  onLoad: function (options) {
    // 可以通过 options 判断一些页面跳转的参数等
    const { pageId = 0, testId = '', testResultUserId = '' } = options;
    this.setData({
      pageId: pageId,
      testId: testId,
      testResultUserId: testResultUserId
    }, () => {
      if (this.data.canIUse) {
        this.verifyAuthInfo();
      }
    });
  },
  // 验证授权
  verifyAuthInfo: function () {
    wx.getSetting({
      success: res => {
        console.log('getSetting suc: ', res.authSetting);
        let { authSetting } = res;
        let userInfoAuth = authSetting['scope.userInfo'];
        if (userInfoAuth) { // 已经授权
          this.login();
        } else { // 未授权，则调起授权弹窗
          this.handleError('小程序无授权无法使用', '授权登录');
        }
      },
      fail: (err) => { // 获取用户设置信息失败
        console.log('getSetting fail: ', err);
        this.handleError('获取用户设置信息失败', '重新获取');
      }
    })
  },
  // 调起授权弹框
  applyForAuth: function (e) {
    if (e.detail.userInfo) {
      this.login();
    } else {
      wx.showModal({
        title: '',
        content: '您点击了拒绝授权，将无法使用小程序',
        showCancel: false,
        confirmText: '知道了',
        success: res => {
        }
      })
    }
  },
  // 获取用户信息
  login: function () {
    let login = new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          console.log("wx login suc: ", res);
          Fetch.post('GatewayService/Login', {
            code: res.code
          }).then((res) => {
            console.log('api login suc: ', res);
            if (res.code == 200) {
              resolve(res);
            } else {
              reject(res);
            }
          }).catch(err => {
            reject(err);
          })
        }
      })
    });

    let getUserInfo = new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      })
    });

    Promise.all([login, getUserInfo]).then((res) => {
      app.globalData.loginInfo = res[0].data;
      app.globalData.userInfo = res[1].userInfo;
      // 页面跳转
      this.pageJump();
    }).catch((err) => {
      this.handleError("登录失败，请重新登录", "重新登录");
    });
  },
  pageJump: function () {
    let { pageId, testId, testResultUserId } = this.data;
    
    if (pageId == 1) {
      // 跳到测试详情页
      wx.redirectTo({
        url: `/pages/test/test?testId=${testId}`,
      }) 
    } else if (pageId == 2) {
      // 跳到测试结果页
      wx.redirectTo({
        url: `/pages/question/question?testId=${testId}&testResultUserId=${testResultUserId}`,
      }) 
    } else {
      // 跳转到首页
      wx.redirectTo({
        url: '/pages/home/home',
      })
    }
  },
  // 错误处理
  handleError: function (failText = '', buttonText = '') {
    this.setData({
      failText: failText,
      buttonText: buttonText
    })
  },
  buttonPressed: function () {
    let { buttonText } = this.data;
    if (buttonText === '重新登录') {
      this.login();
    } else if (buttonText === '重新获取') {
      this.verifyAuthInfo();
    }
  },
})
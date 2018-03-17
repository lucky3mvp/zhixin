//index.js
import Fetch from '../../utils/Fetch.js';
const app = getApp();

Page({
  data: {
    firstAuth: false,
    failText: '',
    buttonText: '',
    pageId: 0, // 0-首页 1-测试详情页 2-测试结果页
    testId: '',
    share: {
      userId: '',
      title: '',
    }
  },
  //页面加载后数据准备
  onLoad: function (options) {
    // 可以通过 options 判断一些页面跳转的参数等
    const { pageId = 0, testId = '' } = options;
    this.setData({
      pageId: pageId,
      testId: testId,
    }, () => {
      this.verifyAuthInfo();
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
          this.getUserInfoAndLogin();
        } else { // 未授权，则调起授权弹窗
          this.applyForAuth();
          if (userInfoAuth === null || userInfoAuth === undefined) {
             // 首次授权，设置标志位
            this.data.firstAuth = true;
          }
        }
      },
      fail: (err) => { // 获取用户设置信息失败
        console.log('getSetting fail: ', err);
        this.handleError('获取用户设置信息失败', '重新获取');
      }
    })
  },
  // 调起授权弹框
  applyForAuth: function () {
    wx.authorize({
      scope: 'scope.userInfo',
      success: (res) => { // 授权成功
        console.log('applyForAuth suc: ', res);
        this.getUserInfoAndLogin();
      },
      fail: (err) => { // 用户拒绝授权，则进入授权失败页
        console.log('applyForAuth fail: ', err);
        if (this.data.firstAuth) {
          this.data.firstAuth = false;
          wx.showModal({
            title: '',
            content: '您点击了拒绝授权，将无法使用本小程序，点击确定重新获取授权',
            showCancel: true,
            confirmText: '确定',
            success: res => {
              if (res.confirm) {
                this.openSetting();
              } else if (res.cancel) {
                this.handleError('小程序无授权暂无法使用', '重新授权');
              }
            },
            fail: errMsg => {
              this.handleError('小程序无授权暂无法使用', '重新授权');
            }
          })
        } else {
          this.handleError('小程序无授权暂无法使用', '重新授权');
        }
      }
    })
  },
  // 获取用户信息
  getUserInfoAndLogin: function () {
    let login = new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          console.log("login suc: ", res);
          Fetch.post('api/login', {
            code: res.code
          }).then((res) => {
            if (res.code === 200) {
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
    const { pageId, testId, testResultUserId } = this.data;
    // 跳转到首页
    wx.redirectTo({
      url: '/pages/home/home',
    })
    if (+pageId === 1) {
      // 跳到测试详情页
      wx.navigateTo({
        url: `/pages/test/test?testId=${testId}`,
      }) 
    } else if (+pageId === 2) {
      // 跳到测试结果页
      
    }
  },
  // 错误处理
  handleError: function (failText = '', buttonText = '') {
    this.setData({
      failText: failText,
      buttonText: buttonText
    })
  },
  // 调起客户端小程序设置界面，返回用户设置的操作结果
  openSetting: function () {
    wx.openSetting({
      success: res => {
        console.log('openSetting suc: ', res)
        // 清楚错误提示
        this.handleError('', '');
        this.verifyAuthInfo();
      },
      fail: errMsg => {
        console.log('openSetting fail: ', errMsg);
        this.handleError('设置失败，请重新操作', '重新授权');
      }
    })
  },
  buttonPressed: function () {
    let { buttonText } = this.data;
    if (buttonText === '重新登录') {
      this.getUserInfoAndLogin();
    } else if (buttonText === '重新授权') {
      this.openSetting();
    } else if (buttonText === '重新获取') {
      this.verifyAuthInfo();
    }
  },
})
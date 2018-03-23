// pages/test/test.js
import Fetch from '../../utils/Fetch.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    init: false,
    testId: "",
    test: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { testId } = options;
    wx.showLoading({
      title: '加载中...',
    })
    this.queryTest(testId);
    this.setData({
      testId,
    }, () => {
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面第一次进入时，onload 里已经会查询一次了，因此没必要再执行一次 queryTest
    if (!this.data.init) {
      this.setData({
        init: true
      })
    } else {
      this.queryTest();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const { test } = this.data;
    const { id, shareImg = "", shareMsg = "", title, chargeType, hasShared, hasTested } = test;

    if (res.from === 'button') {
      return {
        title: shareMsg || title,
        path: `/pages/index/index?testId=${id}&pageId=1`,
        imageUrl: shareImg,
        success: function (res) {
          if (chargeType == 0) { // 免费测试
            wx.showToast({
              title: '分享成功',
            })
          } else if (chargeType == 1) { // 分享免费测试
            wx.showToast({
              title: '分享成功',
              success: () => {
                if (!hasShared) {
                  const { loginInfo } = app.globalData;
                  // 记录分享状态
                  Fetch.post('api/share', {
                    userId: loginInfo.userId,
                    testId: id
                  }).then(res => { }).catch(err => { })
                  // 页面跳转
                  wx.navigateTo({
                    url: `/pages/question/question?testId=${id}&hasTested=${hasTested}`,
                  })
                }
              }
            })
          }
        },
        fail: function (res) { }
      }
    } else {
      return {
        title: `知心测评-${title}`,
        path: '/pages/index/index',
        imageUrl: '',
        success: function (res) { },
        fail: function (res) { }
      }
    }
  },
  queryTest: function (testId) {
    const testaId = testId || this.data.testId;
    const { loginInfo } = app.globalData;
    Fetch.post('api/test/index', {
      testId,
      userId: loginInfo.userId,
    }).then(res => {
      const { categoryMap } = app.globalData;
      const { data } = res;
      this.setData({
        test: {
          ...data,
          categoryText: categoryMap[data.category],
        }
      });
    }).catch(err => {
    })
  },
  gotoTest: function (e) {
    const { test } = this.data;
    const { id, hasTested } = test;
    wx.navigateTo({
      url: `/pages/question/question?testId=${id}&hasTested=${hasTested}`,
    })
  },
  buy: function(e) {
    const { test } = this.data;
    const { id, chargeType, hasTested } = test;
    // 删除下面的代码，开始你的表演
    wx.showModal({
      content: '支付暂未完成，假设支付成功了',
      success: () => {
        wx.navigateTo({
          url: `/pages/question/question?testId=${id}&hasTested=${hasTested}`,
        })
      }
    })
  }
})
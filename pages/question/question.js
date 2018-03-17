// pages/question/question.js
import Fetch from '../../utils/Fetch.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testId: '',
    hasTested: false,
    result : null,
    choices: [],
    questions: [],
    title: "",
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { testId, title, hasTested, testResultUserId } = options;
    if (!testResultUserId) { // 通过他人的链接打开的结果页
      this.queryResult(testId, testResultUserId);
    } else if (hasTested == 'true') { // 参数是字符串...
      this.queryResult(testId);
    } else {
      this.queryQuestions(testId);
    }
    this.setData({
      hasTested: (hasTested == 'true'),
      testId: testId,
      title: title,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const { result, title, testId } = this.data;
    if (res.from === 'button' || this.data.hasTested) {
      const { shareImg = "", shareMsg = "", resultTitle } = result;
      const userId = app.globalId.loginInfo.userId;

      return {
        title: shareMsg || resultTitle || title,
        path: `/pages/index/index?testId=${testId}&userId=${userId}&title=${title}&pageId=2`,
        imageUrl: shareImg,
        success: function (res) { },
        fail: function (res) { }
      }
    } else {
      return {
        title: `知心测评-${title}`,
        path: `/pages/index/index?testId=${testId}&pageId=1`,
        imageUrl: '',
        success: function (res) { },
        fail: function (res) { }
      }
    }
  },
  queryResult: function (testId) {
    Fetch.post('api/test/result', {
      testId: testId,
      userId: app.globalData.loginInfo.userId,
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          result: res.data
        })
      }
    }).catch(err => { })
  },
  queryQuestions: function (testId) {
    Fetch.post('api/test/questions', {
      testId: testId,
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          questions: res.data.result
        })
      }
    }).catch(err => {})
  },
  choose: function(e) {
    const { choice } = e.currentTarget.dataset;
    let { choices, index, questions } = this.data;
    let len = questions.length;
    if (index < (len - 1)) {
      index++;
      choices.push(choice);
      this.setData({
        choices,
        index,
      });
    } else {
      this.submit();
    }
  },
  submit: function() {
    let { choices, testId } = this.data;
    wx.showLoading({
      title: '正在提交...',
      mask: true,
    });
    Fetch.post('api/test/submit', {
      testId: testId,
      userId: app.globalData.loginInfo.userId,
      answers: choices
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        this.setData({
          hasTested: true,
          result: res.data
        })
      } else {
        this.handleSubmitErr();
      }
    }).catch(err => {
      wx.hideLoading();
      this.handleSubmitErr();
    });
  },
  handleSubmitErr: function() {
    wx.showModal({
      content: '哇哦，出错了，重新提交测评？',
      cancelText: '返回',
      confirmText: '好的',
      success: (res) => {
        if (res.confirm) {
          this.submit();
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})
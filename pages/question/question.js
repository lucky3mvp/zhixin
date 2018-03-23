// pages/question/question.js
import Fetch from '../../utils/Fetch.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testId: '',
    status: 0, // 用于控制 ui 的展示，status 为 0 时不出现题目页面的ui, 也不出现结果页面的ui
    hasTested: false,
    fromShare: false,
    result : null,
    choices: [],
    questions: [],
    title: "",
    current: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { testId, hasTested, testResultUserId } = options;
    wx.showLoading({
      title: '加载中...',
    });
    if (testResultUserId) { // 通过他人的链接打开的结果页
      this.queryResult(testId, testResultUserId);
    } else if (hasTested == 'true') { // 参数是字符串...
      this.queryResult(testId);
    } else {
      this.queryQuestions(testId);
    }
    this.setData({
      hasTested: (hasTested == 'true'),
      fromShare: !!testResultUserId,
      testId: testId,
    }, () => {
      wx.hideLoading();
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const { result, title, testId } = this.data;
    if (res.from === 'button' || this.data.hasTested) {
      const { shareImg = "", shareMsg = "", resultTitle } = result;
      const userId = app.globalData.loginInfo.userId;
      return {
        title: shareMsg || resultTitle || title,
        path: `/pages/index/index?testId=${testId}&testResultUserId=${userId}&pageId=2`,
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
  queryResult: function (testId, testResultUserId) {
    const userId = testResultUserId || app.globalData.loginInfo.userId;
    Fetch.post('api/test/result', {
      testId: testId,
      userId: userId,
    }).then(res => {
      if (res.code == 200) {
        this.handleResult('result', res.data);
        // this.setData({
        //   result: res.data
        // })
      }
    }).catch(err => {
    })
  },
  queryQuestions: function (testId) {
    Fetch.post('api/test/questions', {
      testId: testId,
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          status: 1,
          title: res.data.title,
          questions: res.data.result
        })
      }
    }).catch(err => {
    })
  },
  choose: function(e) {
    const { choice } = e.currentTarget.dataset;
    let { choices, current, questions } = this.data;
    let len = questions.length;
    if (current < (len - 1)) {
      current++;
      choices.push(choice);
      this.setData({
        choices,
        current,
      });
    } else if (current === (len - 1)) {
      current++;
      choices.push(choice);
    }
    if (current === len) {
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
        this.handleResult('submit', res.data);
        // this.setData({
        //   hasTested: true,
        //   result: res.data
        // })
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
  },
  handleResult: function(type, result) {
    let _state = {
      status: 1,
    };
    if (type === "submit") {
      _state['hasTested'] = true;
    }
    result.ranking.map(rank => {
      // 用于在页面使用 wx:for 循环出评分的星星
      rank.fullStar = new Array(parseInt(rank.score));
      rank.emptyStar = new Array(parseInt(rank.totalScore - rank.score));
      rank.halfStar = (rank.score % 1 === 0) ? [] : [1];
    });
    _state['result'] = result;
    this.setData(_state);
  },
  gotoHome: function() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }
})
// pages/home/home.js
import Fetch from '../../utils/Fetch.js';
const app = getApp();
// const systemInfo = wx.getSystemInfoSync();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // windowWidth: systemInfo.windowWidth,
    pageNo: 1,
    pageSize: 10,
    totalPage: 0,
    testList: [],
    banner: [],
    loadingStatus: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 不能通过 canvas 去设置渐变背景色：
    // canvas 组件是由客户端创建的原生组件，它的层级是最高的，不能通过 z-index 控制层级
    // 因此会导致内容被 canvas 覆盖
    // this.drawGradient();
    this.queryTestList();
    this.queryBanner();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1
    }, () => {
      this.queryTestList();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let { pageNo, totalPage } = this.data;
    if (pageNo < totalPage) {
      pageNo++;
      this.setData({
        pageNo: pageNo,
        loadingStatus: 'loading'
      }, () => {
        this.queryTestList();
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      const { test } = res.target.dataset;
      const { id, shareImg = "", shareMsg = "", title } = test;

      return {
        title: shareMsg || title,
        path: `/pages/index/index?testId=${id}&pageId=1`,
        imageUrl: shareImg,
        success: function (res) {
          const { loginInfo } = app.globalData;
          Fetch.post('api/share', {
            userId: loginInfo.userId,
            testId: id
          }).then(res => {
            // 成功或失败都跳转
            wx.navigateTo({
              url: `/pages/test/test?testId=${id}`,
            })
          }).catch(err => {
            wx.navigateTo({
              url: `/pages/test/test?testId=${id}`,
            })
          })
        },
        fail: function (res) { }
      }
    } else {
      return {
        title: '知心测评',
        path: '/pages/index/index',
        imageUrl: '',
        success: function (res) { },
        fail: function (res) { }
      }
    }
  },
  drawGradient: function () {
    const ctx = wx.createCanvasContext('swiperBkg');

    // Create linear gradient
    const grd = ctx.createLinearGradient(0, 0, 0, 200 ); // 200 是以 iphone6 的尺寸来算的，wx 貌似会自适应屏幕
    grd.addColorStop(0, '#f5459b');
    grd.addColorStop(1, '#fff');

    // Fill with gradient
    ctx.setFillStyle(grd);
    ctx.fillRect(0, 0, this.data.windowWidth, 200 );
    ctx.draw();
  },
  queryTestList: function (loadMore) {
    Fetch.post('api/home/index', {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
    }).then(res => {
      const { code, data } = res;
      if (code === 200) {
        wx.stopPullDownRefresh(); // 停止上下拉刷新
        const { pageNo, pageSize, totalPage, result } = data;
        const newTestList = pageNo === 1 ? result : this.data.testList.concat(result);
        const { categoryMap } = app.globalData;
        const loadingStatus = pageNo >= totalPage ? 'noMore' : 'loadMore'
        newTestList.forEach(item => {
          item.categoryText = categoryMap[item.category];
          item.chargeTypeText = item.chargeType == 1 ? '分享免费' : '';
        })
        this.setData({
          testList: newTestList,
          pageSize: pageSize || 10,
          loadingStatus,
          pageNo,
          totalPage,
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  gotoTest: function (e) {
    const { id: testId } = e.currentTarget.dataset;
    if (testId) {
      wx.navigateTo({
        url: `/pages/test/test?testId=${testId}`,
      })
    }
  },
  share: function (e) {

  },
  queryBanner: function () {
    Fetch.post('api/home/banner').then(res => {
      const { code, data } = res;
      if (code === 200) {
        const { result } = data;
        this.setData({
          banner: result
        });
      }
    }).catch(err => {
      console.log(err)
    })
  },
})
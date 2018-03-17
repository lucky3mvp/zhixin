/**
 * 首页
 */
'use strict'

const Mock = require('../mock.js')
module.exports = {
  'api/home/index': function (req, res) {
    return Mock.mock({
      "code": 200,
      "desc": 'succes',
      "data": {
        "pageNo": 1,
        "pageSize": 10,
        "totalPage": 1,
        "result|3-10": [{
          "id|+1": 1,
          "listImg|1": ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520678046732&di=aeee2fb3c2f0db6f9b82f8a208b58c34&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Fface%2F8dab23599f838c2c5d756b018f92f62efdb9a9ed.jpg"],
          "title": '@csentence(10, 50)',
          "category|1": ["0", "1", "2", "3"],
          "orgPrice|1": ['88.8', "99.9", "77.7", "66.6"],
          "curPrice|1": ['8.8', "9.9", "7.7", "6.6"],
          "chargeType|1": [0, 1, 2],
          "testedCount|100-100000": 1,
          "shareImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520917691340&di=5bbba4d5b243e8349f7a3c0d0dbde5ff&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2F6d4e927d08614e0c0db9cd6bb0ed820560ef83f8.jpg",
          "shareMsg|1": ["这么火爆的测试，确定不试一下吗？", "分享啦啦啦啦，这就对啦啦啦啦", "哈哈哈哈哈哈", '啦啦啦啦啦了'],
        }]
      }
    })
  },
  'api/home/banner': function () {
    return Mock.mock({
      "code": 200,
      "desc": 'succes',
      "data": {
        "result|3": [{
          "testImg|1": ["http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg", "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg", "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg"], 
          "testId|+1": 1,
          "testTitle": '@csentence(10, 15)',
        }]
      }
    })
  },
}
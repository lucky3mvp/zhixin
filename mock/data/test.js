/**
 * 测平
 */
'use strict'

const Mock = require('../mock.js')
module.exports = {
  'api/test/index': function () {
    return Mock.mock({
      "code": 200,
      "desc": "success",
      "data": {
        "id|+1": 1,
        "bannerImg": ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520686645429&di=cd59f8d17834514d774c770ca5d33da3&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2Ff77c94449a199242f2f5461fe4af8bcd832c872b.jpg"],
        "title": '@csentence(5, 10)',
        "introduction": '@cparagraph(5, 10)',
        "tip": '@cparagraph(5, 10)',
        "category|1": ["0", "1", "2", "3"],
        "orgPrice|1": ['88.8', "99.9", "77.7", "66.6"],
        "curPrice|1": ['8.8', "9.9", "7.7", "6.6"],
        "chargeType|1": [0, 1, 2],
        "testedCount|100-100000": 1,
        "hasTested|1": true,
        "hasShared|1": true,
        "hasPayed|1": true,
        "shareImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520917691340&di=5bbba4d5b243e8349f7a3c0d0dbde5ff&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2F6d4e927d08614e0c0db9cd6bb0ed820560ef83f8.jpg",
        "shareMsg|1": ["这么火爆的测试，确定不试一下吗？", "分享啦啦啦啦，这就对啦啦啦啦", "哈哈哈哈哈哈", '啦啦啦啦啦了']
      }
    })
  },
  'api/test/questions': function () {
    return Mock.mock({
      "code": 200,
      "desc": "success",
      "data": {
        "result|1-3": [{
          "title|1": ["你是猪吗？", "你是白痴吗？", "你是神经病吗？", "你是疯子吗？"],
          "choices": [{
            "head": "A",
            "body": "是",
            "value": 50
          }, {
            "head": "B",
            "body": "是",
            "value": 50
          }, {
            "head": "C",
            "body": "是",
            "value": 50
          }]
        }]
      }
    })
  },
  'api/test/submit': function () {
    return Mock.mock({
      "code": 200,
      "desc": "success",
      "data": {
        "resultTitle": "恭喜完成测试！！",
        "resultDesc": "结果表明，你马上要走狗屎运了",
        "shareImg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521224038870&di=1c0e0296c7b762a294d7935535087330&imgtype=0&src=http%3A%2F%2Fs8.sinaimg.cn%2Fbmiddle%2F493874324413c0266af37",
        "shareMsg": "快来看我的测试结果" 
      }
    })
  },
}
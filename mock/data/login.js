/**
 * 登录
 */
'use strict'

const Mock = require('../mock.js')
module.exports = {
  'api/login': function () {
    return Mock.mock({
      "code": 200,
      "desc": "success",
      "data": {
        'token': 'qazxswedcvfr1234tgb',
        'userId': '1234567890qwertyasdfg',
      }
    })
  },
}
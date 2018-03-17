/**
 * 数据模拟文件
 */
'use strict'
const home = require('./home');
const login = require('./login');
const test = require('./test');

module.exports = Object.assign({}, home, login, test);
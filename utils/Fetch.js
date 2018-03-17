import Config from '../config.dev.js';
import Mock from '../mock/data/index.js';

const { devConfig, hostMap } = Config;

function validMockFetch(config) {
  let {
    url,
    header,
    method = 'POST',
    dataType = 'json',
    responseType = 'text',
    complete
  } = config;
  let methods = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];

  if (url === undefined) { // 未提供 url 的情况
    return {
      status: false,
      msg: 'param url should not be undefined'
    }
  } else if (methods.indexOf(method) < 0) { // 参数 method 不对的情况
    return {
      status: false,
      msg: `param method should not be one of ${methods}`
    }
  } else {
    // 暂时先校验 url 和 method 吧，后续可以完善
    return {
      status: true,
      msg: 'success'
    }
  }
}

function extendWxRequest() {
  Object.defineProperty(wx, 'request', {
    get: function () {
      return function (...args) {
        let opt = args[0];
        let valid = validMockFetch(opt);

        // 参数有不对的情况，直接报错提醒
        if (!valid.status) {
          console.error(valid.msg);
          return;
        }

        // 参数对的情况，返回假数据
        let { url, fail, success } = opt;
        let res = Mock[url];
        if (res === undefined) { // url 不匹配的情况，进入 fail 回调
          let msg = `request ${url} returns 404, please check if the url is correct`;
          console.error(msg);
          fail instanceof Function && fail({
            code: 404,
            desc: msg
          });
          return;
        } else if (res) { // 成功，无论返回码是多少，都进入 success 回调，开发者需根据业务逻辑对返回值进行判断
          // 采用函数的方法写的返回结果
          if (typeof res === 'function') {
            res = res();
          }
          success instanceof Function && success(res);
          return;
        }
      }
    }
  })
}

//增加公共参数
function addCommonParams(params) {
  const app = getApp(); // 应用实例
  const device = wx.getSystemInfoSync(); // 设备信息
  const { loginInfo } = app.globalData; // 登录信息
  const { brand, model, language, version, system, platform, fontSizeSetting, SDKVersion } = device;
  const deviceInfo = `brand=${brand}&model=${model}&planguage=${language}&version=${version}&system=${system}&platform=${platform}&fontSizeSetting=${fontSizeSetting}&SDKVersion=${SDKVersion}`;

  let commonParams = loginInfo ? {
    userId: loginInfo.userId,
    token: loginInfo.token,
    timestamp: Date.now(),
    deviceInfo: deviceInfo.replace(/[<>\s]+/g, ''),
    appId: 'wx8778451d373fc75a',
    apiVersion: '1.0.0'
  } : {};
  return Object.assign({}, params, commonParams);
}

export default {
  wxRequestOrg: null,
  platform: '',
  init: function () {
    console.log('fetch init');
    let platform = wx.getSystemInfoSync().platform;
    // 保存值，方便以后直接使用
    this.platform = platform;

    let host = devConfig.host;
    // 开发环境，则对 wx.request 进行扩展，返回假数据，其他情况发起正常的 wx 请求
    if (host === 'dev') {
      this.wxRequestOrg = wx.request; // 保存原来的 wx.request
      extendWxRequest(); // 扩展 wx.request
    }
  },
  formatUrl: function (url) {
    let host = devConfig.host;
    return `${hostMap[host].base}${url}`;
  },
  post: function (url, params, config) {
    let requestUrl = this.formatUrl(url);
    if (this.platform === 'devtools') {
      console.log(`fetch url: ${requestUrl}`);
      params && console.log(`fetch params: `, params);
    }

    //对参数进行处理: 增加公共参数和加密
    // params = addCommonParams(params)
    return new Promise((resolve, reject) => {
      const task = wx.request({
        ...config,
        url: requestUrl,
        data: params,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: (res) => {
          if (devConfig.host !== 'dev') {
            res = res.data;
          }
          resolve(res);
        },
        fail: (err) => {
          console.log('fetch err', err)
          //判断errMsg为超时或网络异常，则相应配置code字段
          if (err && err.errMsg) {
            if (err.errMsg.indexOf('timeout') || err.errMsg.indexOf('超时')) {
              err['errorCode'] = 408;
            } else {
              err['errorCode'] = 404;
            }
          }
          reject(err);
        }
      });
    })
  },
};
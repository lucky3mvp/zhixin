const devConfig = {
  host: 'online',
}

const hostMap = {
  // 本地开发访问 mock 服务接口 url 前缀
  dev: {
    'base': '',
  },
  // 线上环境接口 url 前缀
  online: {
    'base': 'https://www.zhixinceping.com/'
  }
}

export default {
  hostMap,
  devConfig,
}
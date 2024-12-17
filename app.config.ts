export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/post/index',
    'pages/post-detail/index',
    'pages/search-result/index',
    'pages/mine/index',
    'pages/message/index',
    'pages/my-posts/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  requiredPrivateInfos: [
    'getLocation',
    'chooseLocation',
    'chooseAddress',
    'chooseMedia'
  ],
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  },
  rn: {
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE'
    ]
  }
}) 
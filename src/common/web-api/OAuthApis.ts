import { Api } from '@fangcha/swagger'

export const OAuthApis = {
  OAuthAuthorize: {
    method: 'GET',
    route: '/api/v1/oauth/authorize',
    description: '(直接访问，非异步请求)应用授权入口',
    skipAuth: true,
  } as Api,
  OAuthToken: {
    method: 'POST',
    route: '/api/v1/oauth/token',
    description: '根据授权码获取 Token',
    skipAuth: true,
  } as Api,
  UserInfoGet: {
    method: 'GET',
    route: '/api/v1/oauth/user-info',
    description: '根据 Token 获取用户信息',
    skipAuth: true,
  },
}

import { Api, makeSwaggerBodyDataParameters } from '@fangcha/swagger'
import { AuthSwaggerModelData } from '../models'

export const LoginApis = {
  LoginWithEmail: {
    method: 'POST',
    route: '/api/v1/login/email',
    description: '使用 Email 登录',
    parameters: makeSwaggerBodyDataParameters(AuthSwaggerModelData.Swagger_AccountSimpleParams),
    skipAuth: true,
  } as Api,
  Logout: {
    method: 'GET',
    route: '/api/v1/logout',
    description: '(直接访问，非异步请求)注销',
    skipAuth: true,
  } as Api,
}

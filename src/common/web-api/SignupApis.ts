import { Api, makeSwaggerBodyDataParameters } from '@fangcha/swagger'
import { AuthSwaggerModelData } from '../models'

export const SignupApis = {
  SimpleSignup: {
    method: 'POST',
    route: '/api/v1/signup/simple',
    description: '注册',
    parameters: makeSwaggerBodyDataParameters(AuthSwaggerModelData.Swagger_AccountSimpleParams),
    skipAuth: true,
  } as Api,
}

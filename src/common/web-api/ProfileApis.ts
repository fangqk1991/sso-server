import { Api } from '@fangcha/swagger'
import { AuthSwaggerModelData } from '../models'

export const ProfileApis = {
  ProfileInfoGet: {
    method: 'GET',
    route: '/api/v1/profile',
    description: '获取个人信息',
    responseSchemaRef: AuthSwaggerModelData.Swagger_VisitorCoreInfo,
  } as Api,
}

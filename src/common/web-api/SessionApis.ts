import { Api } from '@fangcha/swagger'

export const SessionApis = {
  SessionInfoGet: {
    method: 'GET',
    route: '/api/v1/session/session-info',
    description: '获取当前会话信息',
    skipAuth: true,
  } as Api,
}

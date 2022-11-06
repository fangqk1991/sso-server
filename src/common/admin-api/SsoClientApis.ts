export const SsoClientApis = {
  MyClientPageDataGet: {
    method: 'GET',
    route: '/api/v1/mine/client',
    description: 'SSO 客户端分页数据获取',
  },
  ClientPageDataGet: {
    method: 'GET',
    route: '/api/v1/client',
    description: 'SSO 客户端分页数据获取',
  },
  ClientCreate: {
    method: 'POST',
    route: '/api/v1/client',
    description: 'SSO 客户端创建',
  },
  ClientInfoGet: {
    method: 'GET',
    route: '/api/v1/client/:clientId',
    description: 'SSO 客户端信息获取',
  },
  ClientInfoUpdate: {
    method: 'PUT',
    route: '/api/v1/client/:clientId',
    description: 'SSO 客户端信息更新',
  },
  ClientDelete: {
    method: 'DELETE',
    route: '/api/v1/client/:clientId',
    description: 'SSO 客户端移除',
  },
  ClientAuthPageDataGet: {
    method: 'GET',
    route: '/api/v1/client/:clientId/user',
    description: '客户端用户授权分页数据获取',
  },
}

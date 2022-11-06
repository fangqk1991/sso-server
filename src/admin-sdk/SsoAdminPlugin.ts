import { RouterSdkPlugin } from '@fangcha/router/lib/sdk'
import { RouterApp } from '@fangcha/router'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoServer } from '../SsoServer'
import { SsoClientSpecs } from '../admin-specs/SsoClientSpecs'
import { KitProfileSpecDocItem } from '@fangcha/backend-kit/lib/profile'

export interface SsoAdminOptions {
  backendPort: number
  baseURL: string
  jwtSecret: string

  ssoServer: SsoServer
}

export const SsoAdminPlugin = (options: SsoAdminOptions): AppPluginProtocol => {
  const ssoServer = options.ssoServer
  const routerApp = new RouterApp({
    useHealthSpecs: true,
    docItems: [
      KitProfileSpecDocItem,
      {
        name: 'SSO Admin',
        pageURL: '/api-docs/v1/sso-admin',
        specs: SsoClientSpecs,
      },
    ],
  })
  routerApp.addMiddlewareBeforeInit(async (ctx, next) => {
    ctx.ssoServer = ssoServer
    await next()
  })
  return RouterSdkPlugin({
    baseURL: options.baseURL,
    backendPort: options.backendPort,
    routerApp: routerApp,
    jwtProtocol: {
      jwtKey: 'sso_admin_jwt',
      jwtSecret: options.jwtSecret,
    },
  })
}

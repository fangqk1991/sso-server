import { RouterApp } from '@fangcha/router'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoClientSpecs } from '../admin-specs/SsoClientSpecs'
import { KitProfileSpecDocItem } from '@fangcha/backend-kit/lib/profile'
import { RouterSdkPlugin } from '@fangcha/backend-kit/lib/router'
import { SsoClientManager } from '../SsoClientManager'

export interface SsoAdminOptions {
  backendPort: number
  baseURL: string
  jwtKey: string
  jwtSecret: string

  clientManager: SsoClientManager
}

export const SsoAdminPlugin = (options: SsoAdminOptions): AppPluginProtocol => {
  const clientManager = options.clientManager
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
    ctx.clientManager = clientManager
    await next()
  })
  return RouterSdkPlugin({
    baseURL: options.baseURL,
    backendPort: options.backendPort,
    routerApp: routerApp,
    jwtProtocol: {
      jwtKey: options.jwtKey,
      jwtSecret: options.jwtSecret,
    },
  })
}

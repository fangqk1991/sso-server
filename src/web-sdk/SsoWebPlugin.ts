import { RouterApp } from '@fangcha/router'
import { SsoServerDocItem } from '../web-specs'
import { SsoSession } from '../services/web/SsoSession'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoServer } from '../SsoServer'
import { RouterSdkPlugin } from '@fangcha/backend-kit/lib/router'
import { JwtSessionSpecDocItem } from '@fangcha/router/lib/main/JwtSessionSpecs'

export interface SsoWebOptions {
  backendPort: number
  ssoServer: SsoServer
}

export const SsoWebPlugin = (options: SsoWebOptions): AppPluginProtocol => {
  const ssoServer = options.ssoServer
  const routerApp = new RouterApp({
    useHealthSpecs: true,
    docItems: [JwtSessionSpecDocItem, SsoServerDocItem],
  })
  routerApp.addMiddlewareBeforeInit(async (ctx, next) => {
    ctx.ssoServer = ssoServer
    await next()
  })
  return RouterSdkPlugin({
    baseURL: ssoServer.options.webBaseURL,
    backendPort: options.backendPort,
    Session: SsoSession,
    routerApp: routerApp,
    jwtProtocol: {
      jwtKey: ssoServer.options.webJwtKey,
      jwtSecret: ssoServer.options.webJwtSecret,
    },
  })
}

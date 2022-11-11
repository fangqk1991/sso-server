import { RouterApp } from '@fangcha/router'
import { LoginSpecs } from '../web-specs/LoginSpecs'
import { AuthSwaggerModelList } from '../common/models'
import { SignupSpecs } from '../web-specs/SignupSpecs'
import { ProfileSpecs } from '../web-specs/ProfileSpecs'
import { SessionSpecs } from '../web-specs/SessionSpecs'
import { OAuthSpecs } from '../web-specs/OAuthSpecs'
import { SsoSession } from '../services/web/SsoSession'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoServer } from '../SsoServer'
import { RouterSdkPlugin } from '@fangcha/backend-kit/lib/router'

export interface SsoWebOptions {
  backendPort: number
  ssoServer: SsoServer
}

export const SsoWebPlugin = (options: SsoWebOptions): AppPluginProtocol => {
  const ssoServer = options.ssoServer
  const routerApp = new RouterApp({
    useHealthSpecs: true,
    docItems: [
      {
        name: 'Login',
        pageURL: '/api-docs/v1/login',
        specs: LoginSpecs,
        models: AuthSwaggerModelList,
      },
      {
        name: 'Signup',
        pageURL: '/api-docs/v1/signup',
        specs: SignupSpecs,
        models: AuthSwaggerModelList,
      },
      {
        name: 'Profile',
        pageURL: '/api-docs/v1/profile',
        specs: [...ProfileSpecs, ...SessionSpecs],
        models: AuthSwaggerModelList,
      },
      {
        name: 'OAuth',
        pageURL: '/api-docs/v1/oauth',
        specs: OAuthSpecs,
        models: AuthSwaggerModelList,
      },
    ],
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

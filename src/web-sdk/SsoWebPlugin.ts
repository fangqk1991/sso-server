import { RouterSdkPlugin } from '@fangcha/router/lib/sdk'
import { RouterApp } from '@fangcha/router'
import { LoginSpecs } from '../web-specs/LoginSpecs'
import { AuthSwaggerModelList } from '../common/models'
import { SignupSpecs } from '../web-specs/SignupSpecs'
import { ProfileSpecs } from '../web-specs/ProfileSpecs'
import { SessionSpecs } from '../web-specs/SessionSpecs'
import { OAuthSpecs } from '../web-specs/OAuthSpecs'
import { KitProfileSpecDocItem } from '@fangcha/backend-kit/lib/profile'
import { Session } from '../services/web/Session'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoServer } from '../SsoServer'

export interface SsoWebOptions {
  backendPort: number
  ssoServer: SsoServer
}

export const SsoWebPlugin = (options: SsoWebOptions): AppPluginProtocol => {
  const ssoServer = options.ssoServer
  const routerApp = new RouterApp({
    useHealthSpecs: true,
    docItems: [
      KitProfileSpecDocItem,
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
  routerApp.addPreHandleMiddleware(async (ctx, next) => {
    ctx.ssoServer = options.ssoServer
    await next()
  })
  return RouterSdkPlugin({
    baseURL: ssoServer.options.webBaseURL,
    backendPort: options.backendPort,
    Session: Session,
    routerApp: routerApp,
    jwtProtocol: {
      jwtKey: 'sso_web_jwt',
      jwtSecret: ssoServer.options.webJwtSecret,
    },
  })
}

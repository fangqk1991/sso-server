import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoClientDocItem } from '../admin-specs/SsoClientSpecs'
import { _RouterState } from '@fangcha/backend-kit/lib/router'
import { SsoClientManager } from '../SsoClientManager'

export interface SsoAdminOptions {
  clientManager: SsoClientManager
}

export const SsoAdminPlugin = (options: SsoAdminOptions): AppPluginProtocol => {
  return {
    appWillLoad: () => {
      const clientManager = options.clientManager
      const routerApp = _RouterState.routerApp
      routerApp.addDocItem(SsoClientDocItem)
      routerApp.addMiddlewareBeforeInit(async (ctx, next) => {
        ctx.clientManager = clientManager
        await next()
      })
    },
    appDidLoad: () => {},
  }
}

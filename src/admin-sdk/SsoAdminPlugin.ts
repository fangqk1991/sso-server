import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoClientDocItem } from '../admin-specs/SsoClientSpecs'
import { _RouterState } from '@fangcha/backend-kit/lib/router'
import { SsoClientManager } from '../SsoClientManager'
import { AccountServer } from '@fangcha/account'
import { AccountSpecDocItems } from '@fangcha/account/lib/admin-specs'

export interface SsoAdminOptions {
  clientManager: SsoClientManager
  accountServer: AccountServer
}

export const SsoAdminPlugin = (options: SsoAdminOptions): AppPluginProtocol => {
  return {
    appWillLoad: () => {
      const clientManager = options.clientManager
      const accountServer = options.accountServer

      const routerApp = _RouterState.routerApp
      routerApp.addDocItem(SsoClientDocItem)
      routerApp.addDocItem(...AccountSpecDocItems)
      routerApp.addMiddlewareBeforeInit(async (ctx, next) => {
        ctx.clientManager = clientManager
        ctx.accountServer = accountServer
        await next()
      })
    },
    appDidLoad: () => {},
  }
}

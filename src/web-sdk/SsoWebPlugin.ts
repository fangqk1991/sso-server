import { SsoServerDocItem } from '../web-specs'
import { SsoSession } from '../services/web/SsoSession'
import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { SsoServer } from '../SsoServer'
import { _RouterState } from '@fangcha/backend-kit/lib/router'
import assert from '@fangcha/assert'

export interface SsoWebOptions {
  ssoServer: SsoServer
}

export const SsoWebPlugin = (options: SsoWebOptions): AppPluginProtocol => {
  return {
    appWillLoad: () => {
      assert.ok(!!_RouterState.routerPlugin, 'routerPlugin missing.', 500)
      _RouterState.routerPlugin.updateOptions({
        Session: SsoSession,
      })
      const ssoServer = options.ssoServer
      const routerApp = _RouterState.routerApp
      routerApp.addDocItem(SsoServerDocItem)
      routerApp.addMiddlewareBeforeInit(async (ctx, next) => {
        ctx.ssoServer = ssoServer
        await next()
      })
    },
    appDidLoad: () => {},
  }
}
